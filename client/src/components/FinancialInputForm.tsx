import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFinancialProfileSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FinancialInputFormProps {
  onRealityCheckComplete: (data: any) => void;
  onProfileCreated: (profileId: string) => void;
}

const formSchema = insertFinancialProfileSchema.extend({
  stockPicks: z.array(z.string()).optional().default([])
});

type FormData = z.infer<typeof formSchema>;

export default function FinancialInputForm({ onRealityCheckComplete, onProfileCreated }: FinancialInputFormProps) {
  const { toast } = useToast();
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      currentSavings: 0,
      totalDebts: 0,
      ppfAmount: 0,
      elssAmount: 0,
      stockPicks: [],
      riskTolerance: 5,
      investmentHorizon: "5-10"
    }
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/financial-profile", {
        ...data,
        stockPicks: selectedStocks
      });
      return response.json();
    },
    onSuccess: (profile) => {
      onProfileCreated(profile.id);
      generateRealityCheck(profile.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create financial profile",
        variant: "destructive"
      });
    }
  });

  const realityCheckMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const response = await apiRequest("POST", "/api/reality-check", { profileId });
      return response.json();
    },
    onSuccess: (data) => {
      onRealityCheckComplete(data);
      toast({
        title: "Reality Check Complete",
        description: "Your financial analysis is ready"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate reality check",
        variant: "destructive"
      });
    }
  });

  const generateRealityCheck = (profileId: string) => {
    realityCheckMutation.mutate(profileId);
  };

  const onSubmit = (data: FormData) => {
    createProfileMutation.mutate(data);
  };

  const popularStocks = [
    { value: "TCS", label: "TCS - Tata Consultancy Services" },
    { value: "RELIANCE", label: "Reliance Industries" },
    { value: "HDFCBANK", label: "HDFC Bank" },
    { value: "INFY", label: "Infosys" },
    { value: "ITC", label: "ITC Limited" },
    { value: "SBIN", label: "State Bank of India" }
  ];

  const handleStockToggle = (stockValue: string) => {
    setSelectedStocks(prev => 
      prev.includes(stockValue) 
        ? prev.filter(s => s !== stockValue)
        : [...prev, stockValue]
    );
  };

  return (
    <section className="py-16 bg-muted/30" id="dashboard">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Tell Us Your Financial Story
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your income, expenses, and investment details. Our quantum algorithms
            will analyze your situation with brutal honesty.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Income Section */}
                  <div className="space-y-6">
                    <CardHeader className="p-0">
                      <CardTitle className="flex items-center text-xl">
                        <i className="fas fa-rupee-sign text-primary mr-2"></i>
                        Income Details
                      </CardTitle>
                    </CardHeader>

                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Monthly Income (₹)
                            <div className="tooltip">
                              <i className="fas fa-info-circle text-muted-foreground"></i>
                              <span className="tooltiptext">
                                Your total monthly income including salary, business income, and other sources
                              </span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="85,000" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-monthly-income"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyExpenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Expenses (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="55,000" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-monthly-expenses"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentSavings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Savings (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="450,000" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-current-savings"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalDebts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outstanding Debts (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1,200,000" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-total-debts"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Investment Section */}
                  <div className="space-y-6">
                    <CardHeader className="p-0">
                      <CardTitle className="flex items-center text-xl">
                        <i className="fas fa-chart-line text-accent mr-2"></i>
                        Investment Portfolio
                      </CardTitle>
                    </CardHeader>

                    <FormField
                      control={form.control}
                      name="ppfAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            PPF Investment (₹)
                            <div className="tooltip">
                              <i className="fas fa-info-circle text-muted-foreground"></i>
                              <span className="tooltiptext">
                                Public Provident Fund - 15 year lock-in, 7.1% current rate
                              </span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="150,000" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-ppf-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="elssAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            ELSS Investment (₹)
                            <div className="tooltip">
                              <i className="fas fa-info-circle text-muted-foreground"></i>
                              <span className="tooltiptext">
                                Equity Linked Savings Scheme - 3 year lock-in, tax benefits under 80C
                              </span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="150,000" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-elss-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Stock Holdings</FormLabel>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {popularStocks.map((stock) => (
                          <div key={stock.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={stock.value}
                              checked={selectedStocks.includes(stock.value)}
                              onChange={() => handleStockToggle(stock.value)}
                              className="rounded border-border"
                              data-testid={`checkbox-stock-${stock.value}`}
                            />
                            <label htmlFor={stock.value} className="text-sm">
                              {stock.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="riskTolerance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Tolerance</FormLabel>
                            <FormControl>
                              <div>
                                <Slider
                                  min={1}
                                  max={10}
                                  step={1}
                                  value={[field.value || 5]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  data-testid="slider-risk-tolerance"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>Conservative</span>
                                  <span>Aggressive</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="investmentHorizon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investment Horizon</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-investment-horizon">
                                  <SelectValue placeholder="Select horizon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-3">1-3 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="5-10">5-10 years</SelectItem>
                                <SelectItem value="10+">10+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="px-8 py-4 text-lg font-semibold"
                    disabled={createProfileMutation.isPending || realityCheckMutation.isPending}
                    data-testid="button-generate-reality-check"
                  >
                    <i className="fas fa-brain mr-2"></i>
                    {createProfileMutation.isPending || realityCheckMutation.isPending 
                      ? "Generating..." 
                      : "Generate Reality Check"
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
