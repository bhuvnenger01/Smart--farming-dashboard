import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FertilizerDisplayProps {
  fertilizerRec: {
    'Nitrogen (kg/ha)': number;
    'Phosphorus (kg/ha)': number;
    'Potassium (kg/ha)': number;
  };
  className?: string;
}

const FertilizerDisplay: React.FC<FertilizerDisplayProps> = ({ fertilizerRec, className }) => {
  return (
    <Card className={`animate-fade-in backdrop-blur-sm bg-white/90 shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Fertilizer Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nitrogen (N)</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {fertilizerRec['Nitrogen (kg/ha)']} kg/ha
                </Badge>
              </div>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">
                Essential for leaf growth and protein formation
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Phosphorus (P)</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {fertilizerRec['Phosphorus (kg/ha)']} kg/ha
                </Badge>
              </div>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">
                Promotes root development and flowering
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Potassium (K)</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {fertilizerRec['Potassium (kg/ha)']} kg/ha
                </Badge>
              </div>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">
                Improves overall plant health and disease resistance
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2 flex flex-col">
            <div className="p-6 rounded-lg bg-primary/5 flex-1">
              <h3 className="font-medium mb-3">Expert Recommendation</h3>
              <p className="text-muted-foreground">
                {fertilizerRec.recommendation_text || 
                  `Based on your soil analysis and crop selection, we recommend a balanced approach to fertilization. 
                  Apply nitrogen-rich fertilizers early in the growing season to promote vegetative growth. 
                  Phosphorus should be incorporated into the soil before planting to support root development. 
                  Potassium can be applied in split doses throughout the growing season to enhance crop quality and disease resistance.`}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-white/80">
                  <p className="text-xs text-muted-foreground">Total NPK</p>
                  <p className="font-medium">
                    {fertilizerRec['Nitrogen (kg/ha)'] + fertilizerRec['Phosphorus (kg/ha)'] + fertilizerRec['Potassium (kg/ha)']} kg/ha
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/80">
                  <p className="text-xs text-muted-foreground">Application</p>
                  <p className="font-medium">Balanced</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/80">
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p className="font-medium">High</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> These recommendations are based on your soil test results and environmental conditions. 
                Actual application rates may need to be adjusted based on specific crop requirements and local agricultural practices.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FertilizerDisplay;
