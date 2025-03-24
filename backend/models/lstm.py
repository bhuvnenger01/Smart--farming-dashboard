# backend/models/lstm.py
import torch
import torch.nn as nn

class LSTMYieldPredictor(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(LSTMYieldPredictor, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        _, (hn, _) = self.lstm(x)
        out = self.fc(hn[-1])
        return out