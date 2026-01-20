
/* Implement travel insights service using Google GenAI API following best practices and provided guidelines. */
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches AI-generated insights for a given travel prompt.
 * Uses gemini-3-flash-preview for general informational tasks.
 */
export const fetchTravelInsights = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error generating AI travel insights:', error);
    return '抱歉，目前無法取得 AI 建議。';
  }
};
