
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ThreeScene from './ThreeScene';

interface RecommendationDisplayProps {
  crops: string[];
  probs: number[];
  className?: string;
}

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ crops, probs, className }) => {
  // Sort crops by probability
  const sortedCrops = [...crops].map((crop, index) => ({ name: crop, prob: probs[index] }))
    .sort((a, b) => b.prob - a.prob);

  return (
    <Card className={`animate-fade-in backdrop-blur-sm bg-white/90 shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Crop Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {sortedCrops.slice(0, 5).map((crop, index) => (
            <div key={crop.name} className="card-hover">
              <div className="flex justify-between items-center mb-1">
                <span className={`font-medium ${index === 0 ? 'text-primary' : ''}`}>
                  {crop.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(crop.prob * 100)}% match
                </span>
              </div>
              <Progress 
                value={crop.prob * 100} 
                className={`h-2 ${index === 0 ? 'bg-primary/20' : 'bg-secondary'}`} 
              />
            </div>
          ))}
          <p className="text-sm text-muted-foreground mt-4">
            Based on your soil composition and environmental factors, these crops are most likely to thrive.
          </p>
        </div>
        
        <div className="relative h-[300px] flex items-center justify-center bg-gradient-to-b from-transparent to-primary/5 rounded-lg overflow-hidden">
          <div className="absolute inset-0 animate-float">
            <ThreeScene />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationDisplay;
