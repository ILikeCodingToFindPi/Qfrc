import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGoalCalculationSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GoalCalculatorProps {
  profileId: string | null;
}

const formSchema = insertGoalCalculationSchema.extend({
  profileId: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export default function GoalCalculator({ profileId }: GoalCalculatorProps) {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalType: "retirement",
      targetAmount: 50000000, // 5 crores
      yearsToGoal: 25,
      expectedReturn: 12.0,
      profileId: profileId || undefined
    }
  });

  const calculateGoalMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/calculate-goal", data);
      return response.json();
    },
    onSuccess: (result) => {
      setCalculationResult(result);
      toast({
        title: "Goal Calculated",
        description: "Your financial goal analysis is ready"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate goal",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FormData) => {
    calculateGoalMutation.mutate(data);
  };

  const goals = [
    {
      value: "home",
      icon: "fas fa-home",
      iconColor: "text-primary",
      title: "Home Purchase",
      description: "Buy your dream home in India"
    },
    {
      value: "education",
      icon: "fas fa-graduation-cap",
      iconColor: "text-accent",
      title: "Child Education",
      description: "Plan for college/engineering/medical"
    },
    {
      value: "retirement",
      icon: "fas fa-umbrella-beach",
      iconColor: "text-secondary",
      title: "Retirement Planning",
      description: "Financial independence calculation"
    }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <section className="py-16 bg-muted/30" id="calculator">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Indian Financial Goals Calculator
          </h2>
          <p className="text-muted-foreground">
            Plan for home buying, child education, and retirement with realistic projections
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Goal Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Your Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="goalType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-4"
                            >
                              {goals.map((goal) => (
                                <div key={goal.value} className="flex items-center space-x-2" data-testid={`goal-option-${goal.value}`}>
                                  <RadioGroupItem value={goal.value} id={goal.value} />
                                  <Label htmlFor={goal.value} className="flex items-center gap-3 flex-1 cursor-pointer p-3 rounded-lg border border-border hover:border-primary transition-colors">
                                    <i className={`${goal.icon} ${goal.iconColor} text-xl`}></i>
                                    <div>
                                      <h4 className="font-semibold text-foreground">{goal.title}</h4>
                                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Amount (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50,000,000"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-target-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearsToGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years to Goal</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-years-to-goal"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedReturn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Return (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="12.0"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-expected-return"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={calculateGoalMutation.isPending}
                      data-testid="button-calculate-goal"
                    >
                      {calculateGoalMutation.isPending ? "Calculating..." : "Calculate Required SIP"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {calculationResult ? 
                    `${calculationResult.goalType.charAt(0).toUpperCase() + calculationResult.goalType.slice(1)} Planning Results` :
                    "Calculation Results"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculationResult ? (
                  <div className="space-y-6">
                    <div className="text-center bg-primary/10 rounded-lg p-6">
                      <h4 className="text-3xl font-bold text-primary mb-2" data-testid="required-sip">
                        {formatCurrency(calculationResult.requiredSip)}/month
                      </h4>
                      <p className="text-muted-foreground">Monthly SIP Required</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground" data-testid="total-investment">
                          {formatCurrency(calculationResult.totalInvestment)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Investment</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent" data-testid="total-returns">
                          {formatCurrency(calculationResult.totalReturns)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Returns</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-3">Reality Check</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Inflation Adjusted Goal:</span>
                          <span className="font-semibold" data-testid="inflation-adjusted-goal">
                            {formatCurrency(calculationResult.inflationAdjustedGoal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Probability of Success:</span>
                          <span className={`font-semibold ${calculationResult.successProbability >= 70 ? 'text-accent' : 'text-secondary'}`} data-testid="success-probability">
                            {calculationResult.successProbability}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-secondary bg-secondary/10 p-4 rounded">
                      <p className="text-sm text-foreground">
                        <strong>AI Insight:</strong> {calculationResult.successProbability >= 80 
                          ? "Your goal is achievable with disciplined investing."
                          : calculationResult.successProbability >= 60
                          ? "Consider extending the timeline or adjusting expectations for better success rate."
                          : "This goal requires significant lifestyle changes or timeline extension to be realistic."
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <i className="fas fa-calculator text-4xl mb-4"></i>
                    <p>Select your goal and calculate to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
