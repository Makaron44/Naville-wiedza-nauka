
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Priority: Local Storage (User provided) > Environment Variable
  const savedSettings = localStorage.getItem('neville_app_settings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      if (settings.apiKey) return settings.apiKey;
    } catch (e) {
      console.error("Error parsing settings for API key", e);
    }
  }
  return process.env.GEMINI_API_KEY || "";
};

export const DEFAULT_SYSTEM_INSTRUCTION = `
    Jesteś duchowym mentorem zainspirowanym naukami Neville'a Goddarda. 
    Twoim celem jest pomoc użytkownikowi w zrozumieniu Prawa Założenia.
    Odpowiadaj w języku polskim. 
    Bądź inspirujący, spokojny, ale stanowczy w kwestii tego, że wyobraźnia jest jedyną rzeczywistością.
    Używaj terminów: "Stan Podobny do Snu", "Trwanie w Końcu", "Wyobraźnia tworzy rzeczywistość", "Dieta Mentalna".
    Gdy użytkownik narzeka, delikatnie przypomnij mu, że to jego wewnętrzne rozmowy tworzą te sytuacje i zachęć do zmiany założenia.
`;

export const getAIResponse = async (
  userMessage: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  systemInstruction: string = DEFAULT_SYSTEM_INSTRUCTION,
  temperature: number = 0.7,
  providedApiKey?: string
) => {
  const apiKey = providedApiKey || getApiKey();

  if (!apiKey) {
    return "Brak klucza API Gemini. Skonfiguruj go w Ustawieniach, aby rozmawiać z Mentorem.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.0-flash-lite-preview-02-05';

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
        topP: 0.8,
        topK: 40
      }
    });

    return response.text || "Nie udało mi się wygenerować odpowiedzi. Spróbuj sformułować pytanie inaczej.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "BŁĄD: Twój klucz API jest nieprawidłowy. Sprawdź go w Ustawieniach.";
    }
    return "Przepraszam, wystąpił problem z połączeniem z Twoją Wyobraźnią (API). Upewnij się, że Twój klucz API jest poprawny i masz połączenie z internetem.";
  }
};

export const testConnection = async (apiKey: string): Promise<{ success: boolean; message: string }> => {
  if (!apiKey) return { success: false, message: "Klucz API nie może być pusty." };

  const ai = new GoogleGenAI({ apiKey });
  try {
    // Simple test call
    await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite-preview-02-05',
      contents: "Test connection",
      config: { maxOutputTokens: 1 }
    });
    return { success: true, message: "Połączenie nawiązane pomyślnie!" };
  } catch (error: any) {
    console.error("Connection test failed:", error);
    return {
      success: false,
      message: error.message?.includes("API_KEY_INVALID")
        ? "Nieprawidłowy klucz API."
        : "Błąd połączenia. Sprawdź klucz i internet."
    };
  }
};
