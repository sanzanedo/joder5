import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Helper to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcription: {
      type: Type.STRING,
      description: "Transcripción literal y fiel de lo que ha dicho el alumno."
    },
    feedback: {
      type: Type.OBJECT,
      properties: {
        grammar: { type: Type.STRING, description: "Feedback específico sobre gramática." },
        vocabulary: { type: Type.STRING, description: "Feedback específico sobre vocabulario." },
        pronunciation: { type: Type.STRING, description: "Feedback específico sobre pronunciación." },
        fluency: { type: Type.STRING, description: "Feedback específico sobre fluidez y conectores." },
        adequacy: { type: Type.STRING, description: "Feedback sobre si cumplió la tarea del tema." }
      },
      required: ["grammar", "vocabulary", "pronunciation", "fluency", "adequacy"]
    },
    generalFeedback: {
      type: Type.STRING,
      description: "Un resumen general alentador y profesional."
    },
    scaffolding: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 3 a 5 palabras o frases útiles de nivel B2/C1 relacionadas con el tema para mejorar."
    },
    score: {
      type: Type.INTEGER,
      description: "Una puntuación estimada de 0 a 100 basada en criterios DELE B2."
    }
  },
  required: ["transcription", "feedback", "generalFeedback", "scaffolding", "score"]
};

export const analyzeAudio = async (audioBlob: Blob, topicContext: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Audio = await blobToBase64(audioBlob);

  const prompt = `
    Analiza la siguiente grabación de un estudiante preparando el DELE B2.
    El tema seleccionado es: ${topicContext}.
    
    Por favor, genera la salida estrictamente en JSON según el esquema proporcionado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || 'audio/webm',
              data: base64Audio
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more consistent analytical results
      }
    });

    if (!response.text) {
      throw new Error("No response text generated");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
