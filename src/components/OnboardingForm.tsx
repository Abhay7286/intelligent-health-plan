import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/types/fitness";
import { Dumbbell, Target, Zap } from "lucide-react";

interface OnboardingFormProps {
  onSubmit: (data: UserData) => void;
  isGenerating: boolean;
}

export const OnboardingForm = ({ onSubmit, isGenerating }: OnboardingFormProps) => {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    goal: "",
    fitnessLevel: "",
    workoutLocation: "",
    dietaryPreference: "",
    medicalHistory: "",
    stressLevel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof UserData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero animate-fade-in">
      <Card className="w-full max-w-2xl shadow-hover">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">AI Fitness Coach</CardTitle>
          <CardDescription className="text-base">
            Let's create your personalized fitness and nutrition plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    required
                    min="10"
                    max="100"
                    value={formData.age || ""}
                    onChange={(e) => updateField("age", parseInt(e.target.value))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    required
                    min="100"
                    max="250"
                    value={formData.height || ""}
                    onChange={(e) => updateField("height", parseInt(e.target.value))}
                    placeholder="170"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    required
                    min="30"
                    max="300"
                    value={formData.weight || ""}
                    onChange={(e) => updateField("weight", parseInt(e.target.value))}
                    placeholder="70"
                  />
                </div>
              </div>
            </div>

            {/* Fitness Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Fitness Goals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal *</Label>
                  <Select value={formData.goal} onValueChange={(value) => updateField("goal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintain">Maintain Weight</SelectItem>
                      <SelectItem value="endurance">Build Endurance</SelectItem>
                      <SelectItem value="strength">Increase Strength</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fitnessLevel">Fitness Level *</Label>
                  <Select value={formData.fitnessLevel} onValueChange={(value) => updateField("fitnessLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workoutLocation">Workout Location *</Label>
                  <Select value={formData.workoutLocation} onValueChange={(value) => updateField("workoutLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietaryPreference">Dietary Preference *</Label>
                  <Select value={formData.dietaryPreference} onValueChange={(value) => updateField("dietaryPreference", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History or Conditions</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => updateField("medicalHistory", e.target.value)}
                    placeholder="Any injuries, conditions, or medications we should know about..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stressLevel">Stress Level</Label>
                  <Select value={formData.stressLevel} onValueChange={(value) => updateField("stressLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stress level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary text-white font-semibold py-6 text-lg"
              disabled={isGenerating}
            >
              {isGenerating ? "Creating Your Plan..." : "Generate My Fitness Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
