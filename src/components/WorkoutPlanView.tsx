import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Exercise, WorkoutDay } from "@/types/fitness";
import { Dumbbell, Clock, Repeat, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WorkoutPlanViewProps {
  workoutPlan: {
    weeklyPlan: WorkoutDay[];
  };
}

export const WorkoutPlanView = ({ workoutPlan }: WorkoutPlanViewProps) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseImage, setExerciseImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const handleExerciseClick = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseImage(null);
    setIsLoadingImage(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-exercise-image", {
        body: { prompt: exercise.name, type: "exercise" }
      });

      if (error) throw error;

      setExerciseImage(data.imageUrl);
    } catch (error) {
      console.error("Error generating exercise image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <>
      <div className="grid gap-4">
        {workoutPlan.weeklyPlan.map((day) => (
          <Card key={day.day} className="shadow-card hover:shadow-hover transition-shadow animate-slide-up">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Day {day.day}</CardTitle>
                <Badge className="gradient-primary text-white">{day.focus}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    onClick={() => handleExerciseClick(exercise)}
                    className="p-4 rounded-lg border border-border hover:border-primary hover:shadow-card transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold group-hover:text-primary transition-colors mb-2">
                          {exercise.name}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Repeat className="w-4 h-4" />
                            {exercise.sets} sets × {exercise.reps} reps
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Rest: {exercise.rest}
                          </span>
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                            <Info className="w-4 h-4" />
                            {exercise.notes}
                          </p>
                        )}
                      </div>
                      <Dumbbell className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isLoadingImage ? (
              <div className="aspect-video bg-muted animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Generating exercise image...</p>
              </div>
            ) : exerciseImage ? (
              <img
                src={exerciseImage}
                alt={selectedExercise?.name}
                className="w-full aspect-video object-cover rounded-lg"
              />
            ) : null}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Sets × Reps</p>
                <p className="font-semibold">
                  {selectedExercise?.sets} × {selectedExercise?.reps}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Rest Time</p>
                <p className="font-semibold">{selectedExercise?.rest}</p>
              </div>
            </div>
            {selectedExercise?.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p>{selectedExercise.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
