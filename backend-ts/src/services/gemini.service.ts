import { GoogleGenerativeAI } from "@google/generative-ai";

export type Sentiment = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

class GeminiService {
  private static instance: GeminiService;
  private genAI: GoogleGenerativeAI | null = null;

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async analyzeSentiment(text: string): Promise<Sentiment> {
    if (!this.genAI) {
      console.warn("[Gemini] API Key not configured. Defaulting to NEUTRAL.");
      return "NEUTRAL";
    }

    try {
      // Use gemini-1.5-pro (latest available model)
      const model = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Analyze the sentiment of the following customer review and respond with ONLY one word: POSITIVE, NEGATIVE, or NEUTRAL.
      Review: "${text}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const sentiment = response.text().trim().toUpperCase() as Sentiment;

      if (["POSITIVE", "NEGATIVE", "NEUTRAL"].includes(sentiment)) {
        return sentiment;
      }
      return "NEUTRAL";
    } catch (error) {
      console.error("[Gemini] Error analyzing sentiment:", error);
      // Return NEUTRAL as fallback to allow review creation to proceed
      return "NEUTRAL";
    }
  }
}

export const geminiService = GeminiService.getInstance();
