import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FitnessPlan, UserData } from "@/types/fitness";
import { WorkoutPlanView } from "./WorkoutPlanView";
import { DietPlanView } from "./DietPlanView";
import { 
  Download, 
  RotateCcw, 
  Volume2, 
  Moon, 
  Sun, 
  Sparkles,
  Dumbbell,
  Apple
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  userData: UserData;
  fitnessPlan: FitnessPlan;
  onRegenerate: () => void;
  onBack: () => void;
}

export const Dashboard = ({ userData, fitnessPlan, onRegenerate, onBack }: DashboardProps) => {
  const [motivationQuote, setMotivationQuote] = useState("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("workout");

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  const fetchDailyQuote = async () => {
    setIsLoadingQuote(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-motivation-quote");
      
      if (error) throw error;
      
      setMotivationQuote(data.quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setMotivationQuote("Push yourself because no one else is going to do it for you!");
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const speakPlan = () => {
    if (!window.speechSynthesis) {
      toast.error("Speech synthesis not supported in your browser");
      return;
    }

    window.speechSynthesis.cancel();

    let textToSpeak = "";
    
    if (activeTab === "workout") {
      textToSpeak = `Here is your workout plan. `;
      fitnessPlan.workoutPlan.weeklyPlan.forEach((day) => {
        textToSpeak += `Day ${day.day}: ${day.focus}. `;
        day.exercises.forEach((exercise) => {
          textToSpeak += `${exercise.name}, ${exercise.sets} sets of ${exercise.reps} reps, rest ${exercise.rest}. `;
        });
      });
    } else {
      textToSpeak = `Here is your diet plan. Daily calories: ${fitnessPlan.dietPlan.dailyCalories}. `;
      const day1 = fitnessPlan.dietPlan.weeklyMeals[0];
      if (day1) {
        textToSpeak += `Breakfast: ${day1.breakfast.name}. `;
        textToSpeak += `Lunch: ${day1.lunch.name}. `;
        textToSpeak += `Dinner: ${day1.dinner.name}. `;
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    
    toast.success("Reading your plan aloud");
  };

  const exportToPDF = () => {
    const content = `
AI Fitness Coach - Personalized Plan

User: ${userData.name}
Goal: ${userData.goal}
Generated: ${new Date().toLocaleDateString()}

WORKOUT PLAN
${fitnessPlan.workoutPlan.weeklyPlan.map(day => `
Day ${day.day}: ${day.focus}
${day.exercises.map(ex => `- ${ex.name}: ${ex.sets} sets x ${ex.reps} reps, rest ${ex.rest}`).join('\n')}
`).join('\n')}

DIET PLAN
Daily Calories: ${fitnessPlan.dietPlan.dailyCalories}
Macros: Protein ${fitnessPlan.dietPlan.dailyMacros.protein}g | Carbs ${fitnessPlan.dietPlan.dailyMacros.carbs}g | Fats ${fitnessPlan.dietPlan.dailyMacros.fats}g

${fitnessPlan.dietPlan.weeklyMeals.map(day => `
Day ${day.day}:
Breakfast: ${day.breakfast.name} (${day.breakfast.calories} cal)
Lunch: ${day.lunch.name} (${day.lunch.calories} cal)
Dinner: ${day.dinner.name} (${day.dinner.calories} cal)
`).join('\n')}

TIPS
${fitnessPlan.tips.map(tip => `- ${tip}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-plan-${userData.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Plan exported successfully!");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-card">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl mb-2">
                  Welcome, {userData.name}! 💪
                </CardTitle>
                <p className="text-muted-foreground">
                  Your personalized {userData.goal} journey starts here
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <Button
                  variant="outline"
                  onClick={speakPlan}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Read Plan
                </Button>
                <Button
                  variant="outline"
                  onClick={exportToPDF}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Motivation Quote */}
            <Card className="gradient-accent border-0">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                  <div className="text-white">
                    <p className="font-semibold mb-1">Daily Motivation</p>
                    <p className="text-sm opacity-90">
                      {isLoadingQuote ? "Loading..." : motivationQuote}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fitness Level</p>
                  <p className="font-semibold capitalize">{userData.fitnessLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                  <Apple className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Calories</p>
                  <p className="font-semibold">{fitnessPlan.dietPlan.dailyCalories} kcal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold capitalize">{userData.workoutLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workout">Workout Plan</TabsTrigger>
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          </TabsList>
          <TabsContent value="workout" className="mt-6">
            <WorkoutPlanView workoutPlan={fitnessPlan.workoutPlan} />
          </TabsContent>
          <TabsContent value="diet" className="mt-6">
            <DietPlanView dietPlan={fitnessPlan.dietPlan} />
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Tips & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {fitnessPlan.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={onRegenerate}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Regenerate Plan
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};
