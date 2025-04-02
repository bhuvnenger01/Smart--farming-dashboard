import React, { useState } from 'react';
import axios from 'axios';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';
import InputForm from './components/InputForm';
import RecommendationDisplay from './components/RecommendationDisplay';
import YieldDisplay from './components/YieldDisplay';
import FertilizerDisplay from './components/FertilizerDisplay';
import WeatherFetcher from './components/WeatherFetcher';
import { Loader } from 'lucide-react';

const App: React.FC = () => {
  const { toast } = useToast();
  const [inputData, setInputData] = useState({
    N: 50,
    P: 50,
    K: 50,
    pH: 6.5,
    temperature: 25,
    humidity: 65,
    rainfall: 80,
    season: 'kharif',
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setInputData({ ...inputData, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Since we can't connect to the actual backend for this demo,
      // we'll simulate the API responses
      
      // Wait for 1.5 seconds to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      /*
      const recommendRes = {
        data: {
          crops: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'],
          probs: [0.87, 0.75, 0.68, 0.52, 0.45]
        }
      };
      
      const yieldRes = {
        data: {
          yield: 45.72 + (Math.random() * 5)
        }
      };
      
      const fertilizerRes = {
        data: {
          N_recommendation: Math.round(120 - inputData.N),
          P_recommendation: Math.round(60 - inputData.P),
          K_recommendation: Math.round(40 - inputData.K),
          recommendation_text: 
            `Based on your soil's NPK levels (${inputData.N}-${inputData.P}-${inputData.K}), we recommend applying a balanced fertilizer approach. For optimal growth, supplement with nitrogen early in the growing season, especially for leafy crops. Add phosphorus before planting and potassium throughout the growing season. Consider your soil's pH of ${inputData.pH} when selecting fertilizer types.`
        }
      };
      */
      
      // For a real implementation, uncomment this code
      
      const [recommendRes, yieldRes, fertilizerRes] = await Promise.all([
        axios.post('http://localhost:5000/recommend', inputData),
        axios.post('http://localhost:5000/predict_yield', inputData),
        axios.post('http://localhost:5000/optimize_fertilizer', inputData),
      ]);
      
      
      setResults({
        crops: recommendRes.data.crops,
        probs: recommendRes.data.probs,
        yield: yieldRes.data.yield,
        fertilizer: fertilizerRes.data,
      });
      
      toast({
        title: "Analysis Complete",
        description: "Your farming recommendations are now available.",
      });
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast({
        title: "Error",
        description: "Could not retrieve farming recommendations. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const setWeather = (weather: any) => {
    setInputData({
      ...inputData,
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall: weather.rainfall,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2 animate-fade-in">Smart Farming Dashboard</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Advanced agricultural analytics powered by real-time data and intelligent recommendations
          </p>
        </header>
        
        <WeatherFetcher setWeather={setWeather} />
        
        <InputForm 
          inputData={inputData} 
          handleChange={handleInputChange} 
          handleSubmit={handleSubmit} 
          className="mb-8"
        />
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <Loader className="h-10 w-10 text-primary animate-spin" />
            <p className="mt-4 text-muted-foreground">Analyzing soil and environmental data...</p>
          </div>
        )}
        
        {results && (
          <div className="grid grid-cols-1 gap-8 animate-fade-in">
            <RecommendationDisplay crops={results.crops} probs={results.probs} />
            <YieldDisplay yieldPred={results.yield} />
            <FertilizerDisplay fertilizerRec={results.fertilizer} />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default App;
