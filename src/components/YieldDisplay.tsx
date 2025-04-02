
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface YieldDisplayProps {
  yieldPred: number;
  className?: string;
}

const YieldDisplay: React.FC<YieldDisplayProps> = ({ yieldPred, className }) => {
  // Generate mock historical data
  const historicalData = [
    { month: 'Jan', yield: yieldPred * 0.2 },
    { month: 'Feb', yield: yieldPred * 0.3 },
    { month: 'Mar', yield: yieldPred * 0.5 },
    { month: 'Apr', yield: yieldPred * 0.7 },
    { month: 'May', yield: yieldPred * 0.8 },
    { month: 'Jun', yield: yieldPred * 0.9 },
    { month: 'Jul', yield: yieldPred * 0.95 },
    { month: 'Aug', yield: yieldPred },
    { month: 'Sep', yield: yieldPred * 0.9 },
    { month: 'Oct', yield: yieldPred * 0.7 },
    { month: 'Nov', yield: yieldPred * 0.4 },
    { month: 'Dec', yield: yieldPred * 0.3 },
  ];

  return (
    <Card className={`animate-fade-in backdrop-blur-sm bg-white/90 shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Yield Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '0.5rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none',
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="yield" 
                    fill="rgba(59, 130, 246, 0.2)" 
                    stroke="rgba(59, 130, 246, 1)" 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <h3 className="text-sm text-muted-foreground mb-1">Expected Yield</h3>
              <p className="text-4xl font-bold text-primary">{yieldPred.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">quintals per hectare</p>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>This yield prediction is based on your soil composition, environmental conditions, and historical growing data for the recommended crops.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YieldDisplay;
