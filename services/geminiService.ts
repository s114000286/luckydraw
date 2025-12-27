
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generate creative team names using Gemini API with a specified theme
export const generateTeamNames = async (count: number, theme: string = "Corporate Superheroes"): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate exactly ${count} creative and fun team names based on the theme: "${theme}". Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    // Access text property and cast parsed JSON for type safety
    const text = response.text;
    if (!text) {
      throw new Error("No text returned from the model");
    }
    
    const names = JSON.parse(text.trim()) as string[];
    return names;
  } catch (error) {
    console.error("Failed to generate team names:", error);
    // Return default names if the API call fails
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};
