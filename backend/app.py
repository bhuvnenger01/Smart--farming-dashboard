# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import numpy as np
import pickle
from models.gcn import GCN
from models.embedding_predictor import EmbeddingPredictor
from models.lstm import LSTMYieldPredictor
from utils.data_processing import preprocess_input
import requests
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class Predictor:
    def __init__(self, run_id=1):
        """Initialize predictor by loading all models and data."""
        try:
            # Load label encoder
            with open(f'models/label_encoder.pkl', 'rb') as f:
                self.le = pickle.load(f)
        except FileNotFoundError:
            raise FileNotFoundError("Label encoder file 'models/label_encoder.pkl' not found. Run train.py first.")

        try:
            # Load fertilizer data
            with open(f'models/fertilizer_data_run{run_id}.pkl', 'rb') as f:
                self.fertilizer_data = pickle.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Fertilizer data file 'models/fertilizer_data_run{run_id}.pkl' not found. Run train.py first.")

        # Load pre-trained models
        try:
            self.model = GCN(in_channels=7, hidden_channels=256, out_channels=len(self.le.classes_))
            self.model.load_state_dict(torch.load(f'models/gcn_run{run_id}.pth', weights_only=True))
        except FileNotFoundError:
            raise FileNotFoundError(f"GCN model file 'models/gcn_run{run_id}.pth' not found. Run train.py first.")

        try:
            self.embedding_predictor = EmbeddingPredictor(7, 256, len(self.le.classes_))
            self.embedding_predictor.load_state_dict(torch.load(f'models/embedding_predictor_run{run_id}.pth', weights_only=True))
        except FileNotFoundError:
            raise FileNotFoundError(f"Embedding Predictor file 'models/embedding_predictor_run{run_id}.pth' not found. Run train.py first.")

        try:
            self.lstm = LSTMYieldPredictor(input_size=7, hidden_size=64, output_size=1)
            self.lstm.load_state_dict(torch.load(f'models/lstm_run{run_id}.pth', weights_only=True))
        except FileNotFoundError:
            raise FileNotFoundError(f"LSTM model file 'models/lstm_run{run_id}.pth' not found. Run train.py first.")

        try:
            with open(f'models/rf_classifier_run{run_id}.pkl', 'rb') as f:
                self.rf = pickle.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Random Forest Classifier file 'models/rf_classifier_run{run_id}.pkl' not found. Run train.py first.")

    def recommend_crop(self, input_data, season):
        """Recommend top 3 crops based on input parameters."""
        input_tensor = preprocess_input(input_data['N'], input_data['P'], input_data['K'],
                                        input_data['temperature'], input_data['humidity'],
                                        input_data['pH'], input_data['rainfall'])
        with torch.no_grad():
            predicted_embedding = self.embedding_predictor(input_tensor)
        probs = self.rf.predict_proba(predicted_embedding.numpy())[0]
        top_indices = np.argsort(probs)[-3:][::-1]  # Top 3 crops
        top_crops = self.le.inverse_transform(top_indices)
        return top_crops.tolist(), probs[top_indices].tolist()

    def predict_yield(self, input_data):
        """Predict crop yield using LSTM."""
        input_tensor = preprocess_input(input_data['N'], input_data['P'], input_data['K'],
                                        input_data['temperature'], input_data['humidity'],
                                        input_data['pH'], input_data['rainfall'])
        with torch.no_grad():
            lstm_input = input_tensor.unsqueeze(1)  # Add sequence dimension
            yield_pred = self.lstm(lstm_input).item()
        return yield_pred

    def optimize_fertilizer(self, input_data):
        """Calculate fertilizer recommendations based on N, P, K deficits."""
        N, P, K = input_data['N'], input_data['P'], input_data['K']
        deficits = np.array([max(0, 100 - N), max(0, 100 - P), max(0, 100 - K)])
        return {
            'Nitrogen (kg/ha)': deficits[0] if deficits[0] > 10 else 0,
            'Phosphorus (kg/ha)': deficits[1] if deficits[1] > 10 else 0,
            'Potassium (kg/ha)': deficits[2] if deficits[2] > 10 else 0
        }

# Load predictor once at startup
try:
    predictor = Predictor(run_id=1)
except FileNotFoundError as e:
    print(f"Error: {e}")
    exit(1)

@app.route('/recommend', methods=['POST'])
def recommend():
    """API endpoint for crop recommendation."""
    data = request.json
    try:
        crops, probs = predictor.recommend_crop(data, data.get('season', 'kharif'))
        return jsonify({'crops': crops, 'probs': probs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    """API endpoint for yield prediction."""
    data = request.json
    try:
        yield_pred = predictor.predict_yield(data)
        return jsonify({'yield': yield_pred})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/optimize_fertilizer', methods=['POST'])
def optimize_fertilizer():
    """API endpoint for fertilizer optimization."""
    data = request.json
    try:
        fertilizer_rec = predictor.optimize_fertilizer(data)
        return jsonify(fertilizer_rec)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/weather', methods=['POST'])
def get_weather():
    """API endpoint to fetch real-time weather data."""
    data = request.json
    lat, lon = data['lat'], data['lon']
    api_key = '204365a64a6e01e8c3ee829aced1886b'  # Replace with your OpenWeather API key
    url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric'
    try:
        response = requests.get(url).json()
        if response['cod'] != 200:
            raise ValueError(f"API Error: {response['message']}")
        weather = {
            'temperature': response['main']['temp'],
            'humidity': response['main']['humidity'],
            'rainfall': response.get('rain', {}).get('1h', 0)
        }
        return jsonify(weather)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)