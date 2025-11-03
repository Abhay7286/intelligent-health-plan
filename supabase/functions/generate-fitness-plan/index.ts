import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userData } = await req.json();
    console.log("Generating fitness plan for:", userData);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert fitness coach and nutritionist. Generate a personalized, comprehensive fitness and diet plan based on user data.

Rules:
- Create a 7-day workout plan with specific exercises, sets, reps, and rest times
- Include proper warm-up and cool-down routines
- Adjust intensity based on fitness level
- Consider workout location for equipment availability
- Create detailed meal plans for each day (breakfast, lunch, dinner, 2 snacks)
- Calculate approximate calories and macros for each meal
- Respect dietary preferences strictly
- Include hydration tips and lifestyle advice
- Add motivational tips for each day
- Be specific with exercise names and food items

Return ONLY valid JSON with this structure:
{
  "workoutPlan": {
    "weeklyPlan": [
      {
        "day": 1,
        "focus": "Upper Body",
        "exercises": [
          {
            "name": "Barbell Bench Press",
            "sets": 4,
            "reps": "8-10",
            "rest": "90 seconds",
            "notes": "Focus on controlled movement"
          }
        ]
      }
    ]
  },
  "dietPlan": {
    "dailyCalories": 2200,
    "dailyMacros": {
      "protein": 165,
      "carbs": 220,
      "fats": 73
    },
    "weeklyMeals": [
      {
        "day": 1,
        "breakfast": {
          "name": "Oatmeal with Berries",
          "calories": 350,
          "items": ["50g oats", "200ml almond milk", "100g mixed berries", "1 tbsp honey"]
        },
        "lunch": {
          "name": "Grilled Chicken Salad",
          "calories": 450,
          "items": ["150g grilled chicken", "Mixed greens", "Cherry tomatoes", "Olive oil dressing"]
        },
        "dinner": {
          "name": "Salmon with Sweet Potato",
          "calories": 550,
          "items": ["180g salmon fillet", "200g sweet potato", "Steamed broccoli"]
        },
        "snack1": {
          "name": "Greek Yogurt",
          "calories": 150,
          "items": ["200g Greek yogurt", "Handful of almonds"]
        },
        "snack2": {
          "name": "Protein Shake",
          "calories": 200,
          "items": ["1 scoop whey protein", "1 banana", "250ml water"]
        }
      }
    ]
  },
  "tips": [
    "Stay hydrated - aim for 3-4 liters of water daily",
    "Get 7-9 hours of quality sleep",
    "Track your progress weekly"
  ]
}`;

    const userPrompt = `Generate a personalized fitness and nutrition plan for:

Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height} cm
Weight: ${userData.weight} kg
Goal: ${userData.goal}
Fitness Level: ${userData.fitnessLevel}
Workout Location: ${userData.workoutLocation}
Dietary Preference: ${userData.dietaryPreference}
${userData.medicalHistory ? `Medical History: ${userData.medicalHistory}` : ""}
${userData.stressLevel ? `Stress Level: ${userData.stressLevel}` : ""}

Create a comprehensive 7-day plan that will help them achieve their ${userData.goal} goal.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    if (content.includes("```json")) {
      jsonContent = content.split("```json")[1].split("```")[0].trim();
    } else if (content.includes("```")) {
      jsonContent = content.split("```")[1].split("```")[0].trim();
    }
    
    const fitnessData = JSON.parse(jsonContent);

    return new Response(JSON.stringify(fitnessData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error generating fitness plan:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate fitness plan" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
