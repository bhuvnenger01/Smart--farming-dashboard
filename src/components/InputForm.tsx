
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InputData {
  N: number;
  P: number;
  K: number;
  pH: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  season: string;
}

interface InputFormProps {
  inputData: InputData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: () => void;
  className?: string;
}

const InputForm: React.FC<InputFormProps> = ({ inputData, handleChange, handleSubmit, className }) => {
  // Create a custom handler for Select component
  const handleSelectChange = (value: string) => {
    // Cast to unknown first, then to the expected type to fix the type error
    const event = {
      target: {
        name: 'season',
        value: value,
        type: 'select'
      }
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(event);
  };

  return (
    <Card className={`animate-fade-in backdrop-blur-sm bg-white/90 shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Soil & Environmental Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="N">Nitrogen (N)</Label>
              <Input
                id="N"
                name="N"
                type="number"
                placeholder="0-140"
                value={inputData.N}
                onChange={handleChange}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="P">Phosphorus (P)</Label>
              <Input
                id="P"
                name="P"
                type="number"
                placeholder="0-140"
                value={inputData.P}
                onChange={handleChange}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="K">Potassium (K)</Label>
              <Input
                id="K"
                name="K"
                type="number"
                placeholder="0-200"
                value={inputData.K}
                onChange={handleChange}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pH">pH Value</Label>
              <Input
                id="pH"
                name="pH"
                type="number"
                step="0.1"
                placeholder="0-14"
                value={inputData.pH}
                onChange={handleChange}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                placeholder="0-45"
                value={inputData.temperature}
                onChange={handleChange}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                name="humidity"
                type="number"
                placeholder="0-100"
                value={inputData.humidity}
                onChange={handleChange}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rainfall">Rainfall (mm)</Label>
              <Input
                id="rainfall"
                name="rainfall"
                type="number"
                placeholder="0-300"
                value={inputData.rainfall}
                onChange={handleChange}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="season">Growing Season</Label>
              <Select value={inputData.season} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                  <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                  <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit"
            className="mt-6 w-full bg-primary hover:bg-primary/90 text-white transition-all"
          >
            Analyze and Generate Recommendations
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
