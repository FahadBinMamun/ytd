
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeVideoContent = async (videoId: string): Promise<AnalysisResult> => {
  const prompt = `
    You are a YouTube video content analyst. A user wants to understand a video better without watching it fully.
    The video's ID is "${videoId}".

    Your task is to:
    1.  Generate a plausible, engaging title for this video based on what a video with this ID might be about.
    2.  Write a concise, informative summary of the hypothetical video content (around 3-4 sentences).
    3.  List exactly 5 key takeaways or talking points from the video.

    Provide the response strictly in JSON format. The JSON object must have the following keys: "title", "summary", and "keyPoints" (which should be an array of 5 strings). Do not include any other text or markdown formatting outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    
    const parsedData: AnalysisResult = JSON.parse(jsonStr);

    // Basic validation
    if (!parsedData.title || !parsedData.summary || !Array.isArray(parsedData.keyPoints)) {
        throw new Error("Invalid JSON structure received from API.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error fetching or parsing Gemini API response:", error);
    throw new Error("Failed to analyze video content. Please check the API key and network connection.");
  }
};
