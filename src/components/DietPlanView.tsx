import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DailyMeals, Meal } from "@/types/fitness";
import { Utensils, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DietPlanViewProps {
  dietPlan: {
    dailyCalories: number;
    dailyMacros: {
      protein: number;
      carbs: number;
      fats: number;
    };
    weeklyMeals: DailyMeals[];
  };
}

export const DietPlanView = ({ dietPlan }: DietPlanViewProps) => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealImage, setMealImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const handleMealClick = async (meal: Meal) => {
    setSelectedMeal(meal);
    setMealImage(null);
    setIsLoadingImage(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-exercise-image", {
        body: { prompt: meal.name, type: "meal" }
      });

      if (error) throw error;

      setMealImage(data.imageUrl);
    } catch (error) {
      console.error("Error generating meal image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const mealTypes = [
    { key: "breakfast", label: "Breakfast", icon: "🌅" },
    { key: "lunch", label: "Lunch", icon: "☀️" },
    { key: "dinner", label: "Dinner", icon: "🌙" },
    { key: "snack1", label: "Snack 1", icon: "🍎" },
    { key: "snack2", label: "Snack 2", icon: "🥤" },
  ];

  return (
    <>
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle>Daily Nutrition Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Calories</p>
              <p className="text-2xl font-bold text-primary">{dietPlan.dailyCalories}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Protein</p>
              <p className="text-2xl font-bold text-secondary">{dietPlan.dailyMacros.protein}g</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Carbs</p>
              <p className="text-2xl font-bold text-accent">{dietPlan.dailyMacros.carbs}g</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Fats</p>
              <p className="text-2xl font-bold">{dietPlan.dailyMacros.fats}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {dietPlan.weeklyMeals.map((dayMeals) => (
          <Card key={dayMeals.day} className="shadow-card hover:shadow-hover transition-shadow animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl">Day {dayMeals.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mealTypes.map(({ key, label, icon }) => {
                  const meal = dayMeals[key as keyof Omit<DailyMeals, 'day'>] as Meal;
                  return (
                    <div
                      key={key}
                      onClick={() => handleMealClick(meal)}
                      className="p-4 rounded-lg border border-border hover:border-primary hover:shadow-card transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{icon}</span>
                            <Badge variant="outline">{label}</Badge>
                          </div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors mb-2">
                            {meal.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Flame className="w-4 h-4" />
                            <span>{meal.calories} kcal</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {meal.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Utensils className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMeal} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMeal?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isLoadingImage ? (
              <div className="aspect-video bg-muted animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Generating meal image...</p>
              </div>
            ) : mealImage ? (
              <img
                src={mealImage}
                alt={selectedMeal?.name}
                className="w-full aspect-video object-cover rounded-lg"
              />
            ) : null}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold">{selectedMeal?.calories} kcal</span>
              </div>
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <ul className="space-y-1">
                {selectedMeal?.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
