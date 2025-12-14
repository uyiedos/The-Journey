import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIResponse, LevelConfig } from '../types';
import { LanguageCode, LANGUAGES } from '../translations';

const apiKey = process.env.API_KEY;
// Only instantiate if key exists, otherwise we use simulation mode
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The guide's response to the user, strictly in character.",
    },
    isSuccess: {
      type: Type.BOOLEAN,
      description: "Whether the user's response demonstrates spiritual growth/overcoming the sin enough to proceed.",
    },
    scriptureRef: {
      type: Type.STRING,
      description: "A relevant bible verse reference (e.g., 'James 1:5') if applicable, else null.",
      nullable: true
    }
  },
  required: ["text", "isSuccess"],
};

export const generateGuideResponse = async (
  level: LevelConfig, 
  userMessage: string, 
  history: string[],
  language: LanguageCode
): Promise<AIResponse> => {
  
  // --- FALLBACK: SIMULATION MODE (No API Key) ---
  if (!apiKey || !ai) {
    return simulateAIResponse(level, userMessage);
  }

  // --- REAL AI MODE (Gemini) ---
  const { bibleContext } = level;
  const languageName = LANGUAGES.find(l => l.code === language)?.name || 'English';

  const systemInstruction = `
    You are 'The Guide', a wise spiritual mentor. 
    We are currently in a simulation of: ${level.name}.
    
    CRITICAL: YOU MUST COMMUNICATE IN ${languageName.toUpperCase()}.
    
    THE SCENE:
    - Story: ${bibleContext.storyTitle} (${bibleContext.reference})
    - Key Character involved: ${bibleContext.character}
    - Situation: ${bibleContext.narrativeIntro}
    - Sin to Overcome: ${level.sin}
    - Target Virtue: ${level.virtue}
    
    YOUR ROLE:
    - Act as a narrator and spiritual director.
    - Immerse the user in the specific Bible story mentioned above. 
    - Ask them how they would advise the character (${bibleContext.character}) or how they see themselves in this story.
    - The goal is for the user to admit the struggle with this sin and ask for God's help (Prayer).
    
    RULES:
    - Be concise (max 3 sentences).
    - If the user shows deep reflection, repentance, or offers a prayer related to ${level.virtue}, mark 'isSuccess' as true.
    - When 'isSuccess' is true, quote or reference: ${bibleContext.keyVerse}.
    - If the user is casual or dismissive, gently challenge them using the story context.
  `;

  const prompt = `
    History of conversation:
    ${history.join('\n')}
    
    User's latest input: "${userMessage}"
    
    Respond in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to simulation if API fails even if key exists
    return simulateAIResponse(level, userMessage);
  }
};

export const getIntroMessage = async (level: LevelConfig, language: LanguageCode): Promise<string> => {
   // --- FALLBACK: SIMULATION MODE ---
   if (!apiKey || !ai) {
     return level.bibleContext.narrativeIntro;
   }

   // --- REAL AI MODE ---
   const { bibleContext } = level;
   const languageName = LANGUAGES.find(l => l.code === language)?.name || 'English';

   const systemInstruction = `
    You are 'The Guide'. Introduce the user to the current scene.
    CRITICAL: YOU MUST COMMUNICATE IN ${languageName.toUpperCase()}.
    
    Scene: ${level.name} - ${bibleContext.storyTitle}.
    Narrative (Translate this context to ${languageName}): ${bibleContext.narrativeIntro}
    
    Task: Set the scene vividly in 2-3 sentences in ${languageName} and ask the user a question about how they relate to ${bibleContext.character}'s struggle with ${level.sin}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Start the level.",
      config: {
        systemInstruction,
      }
    });
    return response.text || bibleContext.narrativeIntro;
  } catch (e) {
    return bibleContext.narrativeIntro;
  }
}

// --- SIMULATION LOGIC (Offline/Free Mode) ---
const simulateAIResponse = async (level: LevelConfig, input: string): Promise<AIResponse> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerInput = input.toLowerCase();
  
  // Keywords that indicate spiritual progress/success
  const successKeywords = [
    'pray', 'god', 'lord', 'jesus', 'faith', 'forgive', 'sorry', 'repent', 
    'help', 'spirit', 'trust', 'mercy', 'grace', 'amen', 'believe', 'sin', 
    'love', 'peace', 'truth', 'yes'
  ];

  const hasKeyword = successKeywords.some(k => lowerInput.includes(k));
  const isLongEnough = input.length > 8; // Prevent single word spam

  // Logic: If they use spiritual language and write a decent sentence, they pass.
  if (hasKeyword && isLongEnough) {
    return {
      text: `(Simulation) Your heart speaks true. The grip of ${level.sin} loosens as you embrace ${level.virtue}. The path forward is revealed.`,
      isSuccess: true,
      scriptureRef: level.bibleContext.keyVerse
    };
  }

  // Failure response
  return {
    text: `(Simulation) The shadow of ${level.sin} still clouds your path. You must look deeper within. Try asking for help or offering a prayer of ${level.virtue}.`,
    isSuccess: false
  };
};