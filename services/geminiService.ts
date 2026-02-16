
import { GoogleGenAI, Type } from "@google/genai";

// Helper to convert a URL or blob to Base64 and get its mime type
async function urlToBase64Data(url: string): Promise<{ base64: string, mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({ base64: base64String, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const analyzePOD = async (imageData: string, challanNumber: string) => {
  // Always use process.env.API_KEY directly as a named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let base64Data = imageData;
    let mimeType = 'image/jpeg'; // Default
    
    // Check if imageData is a URL (starts with http) or a data URL
    if (imageData.startsWith('http')) {
      const result = await urlToBase64Data(imageData);
      base64Data = result.base64;
      mimeType = result.mimeType;
    } else if (imageData.includes('base64,')) {
      const parts = imageData.split(';base64,');
      mimeType = parts[0].split(':')[1];
      base64Data = parts[1];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `Analyze this Proof of Delivery (POD) document (${mimeType}). 
            Verification requirements:
            1. Does it contain a legible signature?
            2. Does it have a company stamp?
            3. Does the document mention the challan number: ${challanNumber}?
            4. Is the delivery date clear?
            
            Return the analysis in a strictly formatted JSON structure.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN, description: "Whether the POD meets basic standards." },
            confidenceScore: { type: Type.NUMBER, description: "Score from 0-100 on how reliable the scan is." },
            hasSignature: { type: Type.BOOLEAN },
            hasStamp: { type: Type.BOOLEAN },
            challanMatch: { type: Type.BOOLEAN },
            summary: { type: Type.STRING, description: "Brief audit report summary." },
          },
          required: ["isValid", "confidenceScore", "summary"],
          propertyOrdering: ["isValid", "confidenceScore", "hasSignature", "hasStamp", "challanMatch", "summary"]
        },
      },
    });

    if (!response.text) {
      throw new Error("No response text returned from Gemini");
    }

    const result = JSON.parse(response.text.trim());
    return result;
  } catch (error) {
    console.error("Gemini POD Analysis failed:", error);
    throw error;
  }
};
