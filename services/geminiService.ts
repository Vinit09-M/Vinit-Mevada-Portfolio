import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

// Helper to interact with Gemini
// We inject the current portfolio data as context so the AI answers accurately about Vinit.
export const generateTerminalResponse = async (
  query: string,
  contextData: PortfolioData
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Error: API_KEY is missing. Please configure your environment.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const contextPrompt = `
    You are a CLI (Command Line Interface) assistant for the portfolio website of ${contextData.name}.
    
    Here is the current system data (JSON format):
    ${JSON.stringify(contextData)}

    Your persona:
    - You are a helpful, slightly technical, "hacker-style" system assistant.
    - Keep answers concise and text-based (no markdown bolding, just plain text or simple spacing).
    - Use technical jargon where appropriate but remain clear.
    - If asked about contact info, provide it from the data.
    - If asked about skills, list them.
    - If asked something not in the data, politely say you don't have access to that subsystem.

    User Query: ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPrompt,
    });
    return response.text || "System Error: No response received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System Critical: Connection to AI core failed.";
  }
};