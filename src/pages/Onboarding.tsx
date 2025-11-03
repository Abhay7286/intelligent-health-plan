import { useState } from "react";
import { OnboardingForm } from "@/components/OnboardingForm";
import { Dashboard } from "@/components/Dashboard";
import { UserData, FitnessPlan } from "@/types/fitness";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Onboarding = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlan = async (data: UserData) => {
    setIsGenerating(true);
    toast.loading("Creating your personalized fitness plan...");

    try {
      const { data: planData, error } = await supabase.functions.invoke("generate-fitness-plan", {
        body: { userData: data }
      });

      if (error) throw error;

      setUserData(data);
      setFitnessPlan(planData);
      
      // Save to localStorage
      localStorage.setItem("fitnessPlan", JSON.stringify(planData));
      localStorage.setItem("userData", JSON.stringify(data));
      
      toast.dismiss();
      toast.success("Your personalized plan is ready!");
    } catch (error: any) {
      console.error("Error generating plan:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to generate plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (userData) {
      generatePlan(userData);
    }
  };

  const handleBack = () => {
    setUserData(null);
    setFitnessPlan(null);
    localStorage.removeItem("fitnessPlan");
    localStorage.removeItem("userData");
  };

  // Check for saved plan on mount
  useState(() => {
    const savedPlan = localStorage.getItem("fitnessPlan");
    const savedUserData = localStorage.getItem("userData");
    
    if (savedPlan && savedUserData) {
      setFitnessPlan(JSON.parse(savedPlan));
      setUserData(JSON.parse(savedUserData));
    }
  });

  if (fitnessPlan && userData) {
    return (
      <Dashboard
        userData={userData}
        fitnessPlan={fitnessPlan}
        onRegenerate={handleRegenerate}
        onBack={handleBack}
      />
    );
  }

  return <OnboardingForm onSubmit={generatePlan} isGenerating={isGenerating} />;
};

export default Onboarding;
