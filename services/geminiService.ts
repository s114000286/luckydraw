
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

// Generate creative team names using Gemini API with a specified theme
export const generateTeamNames = async (count: number, theme: string = "Corporate Superheroes"): Promise<string[]> => {
  try {
    const ai = getAI();
    if (!ai) {
        console.warn("API key not found, using fallback names");
        throw new Error("API key missing");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
    console.warn("Failed to generate team names (using fallback):", error);
    // Return default names if the API call fails or key is missing
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};
