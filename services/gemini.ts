
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Activity, CareerPath, PathwayRecommendation, Quest, Mentor } from "../types";

// Initialize Gemini
// NOTE: In a real production app, never expose keys on the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Helper to clean JSON string from Markdown code blocks if present.
 */
const cleanAndParseJson = <T>(text: string): T => {
  try {
    // Remove markdown wrapping like ```json ... ```
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text);
    throw new Error("Failed to parse AI response. Please try again.");
  }
};

/**
 * Generates a fun, hands-on STEM activity for Primary Kids (G1-G6).
 */
export const generateKidActivity = async (interest: string): Promise<Activity> => {
  const prompt = `
    Create a fun, hands-on STEM learning activity for an African primary school student (Grade 1-6) interested in "${interest}".
    The activity must use locally available, low-cost materials found in a typical African household.
    Keep language simple, encouraging, and playful.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A fun title for the activity" },
      description: { type: Type.STRING, description: "Step-by-step instructions, clear and simple" },
      materials: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of household materials needed"
      },
      duration: { type: Type.STRING, description: "Estimated time (e.g., '30 mins')" }
    },
    required: ["title", "description", "materials", "duration"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a friendly, energetic primary school teacher in Kenya. You love Science and Arts."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return cleanAndParseJson<Activity>(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates a gamified learning quest question for Kids.
 */
export const generateQuest = async (subject: string): Promise<Quest> => {
  const prompt = `
    Create a single, fun, multiple-choice quiz question for a primary school student (Grade 3-5) about "${subject}".
    Context: African curriculum.
    Make it engaging!
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      subject: { type: Type.STRING },
      question: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 possible answers" },
      correctIndex: { type: Type.INTEGER, description: "Index of correct answer (0-3)" },
      explanation: { type: Type.STRING, description: "Short fun fact explaining the answer" },
      points: { type: Type.INTEGER, description: "Points value (e.g., 10, 20, 50)" }
    },
    required: ["subject", "question", "options", "correctIndex", "explanation", "points"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a gamified tutor. Keep questions simple, local, and fun."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return cleanAndParseJson<Quest>(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates Pathway recommendations for JSS (G7-G9) based on strengths/interests.
 */
export const generatePathwayAdvice = async (
  interests: string, 
  strengths: string
): Promise<PathwayRecommendation[]> => {
  const prompt = `
    Based on the student's interests: "${interests}" and academic strengths: "${strengths}", 
    recommend the top 3 most suitable specific CBC (Competency Based Curriculum) Senior School Tracks.
    
    Select specific tracks from the following options:
    1. STEM: Pure Sciences
    2. STEM: Applied Sciences
    3. STEM: Technical & Engineering
    4. STEM: Career & Technology Studies (CTS)
    5. Social Sciences: Humanities
    6. Social Sciences: Business Studies
    7. Arts & Sports: Sports Science
    8. Arts & Sports: Performing Arts
    9. Arts & Sports: Visual Arts

    Provide a fit score and specific reasoning linking their traits to the specific track.
    Mention school clubs that would help them prepare.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        pathwayName: { type: Type.STRING, description: "The specific track name (e.g. 'STEM: Technical & Engineering')" },
        fitScore: { type: Type.INTEGER, description: "Score out of 100" },
        reasoning: { type: Type.STRING },
        recommendedClubs: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["pathwayName", "fitScore", "reasoning", "recommendedClubs"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert CBC guidance counselor. You understand the detailed Kenyan/African education system and specific senior school tracks."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return cleanAndParseJson<PathwayRecommendation[]>(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates Career advice for Senior School (G10-G12).
 */
export const generateCareerGuidance = async (
  subjects: string,
  hobbies: string
): Promise<CareerPath[]> => {
  const prompt = `
    A Senior Secondary student takes these subjects: "${subjects}" and enjoys: "${hobbies}".
    Suggest 6 to 8 specific careers that align with the future job market in Africa.
    Include a diverse mix of:
    - Emerging Technology roles (AI, Data, Robotics)
    - Green Economy & Sustainability roles (Renewable Energy, Agri-tech, Conservation)
    - Modern Essential Services (Healthcare, Infrastructure, Creative Economy)
    
    For each career, provide:
    1. A specific Title.
    2. A category (Classify as "Emerging Tech", "Green Economy", "Healthcare", "Creative", etc.).
    3. University Degree programs.
    4. TVET (Technical and Vocational Education and Training) diploma/certificate options.
    Ensure both are valid and prestigious paths.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        category: { type: Type.STRING, description: "Category like 'Green Economy', 'Emerging Tech', 'Engineering', etc." },
        description: { type: Type.STRING },
        requiredSubjects: { type: Type.ARRAY, items: { type: Type.STRING } },
        potentialJobs: { type: Type.ARRAY, items: { type: Type.STRING } },
        tvetOptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant diploma/certificate courses" },
        universityPrograms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant university degree programs" }
      },
      required: ["title", "category", "description", "requiredSubjects", "potentialJobs", "tvetOptions", "universityPrograms"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a senior career mentor. Provide a diverse range of 6-8 career options, ensuring a mix of tech, green economy, and traditional sectors relevant to African development."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return cleanAndParseJson<CareerPath[]>(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Finds/Generates Mentor profiles for Senior School students.
 */
export const findMentors = async (careerInterest: string): Promise<Mentor[]> => {
  const prompt = `
    Generate 3 fictional profiles of STEM professionals or university students in Africa who could act as mentors for a high school student interested in "${careerInterest}".
    They should be inspiring, realistic, and diverse (gender/region).
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        role: { type: Type.STRING },
        company: { type: Type.STRING, description: "Company or University name" },
        location: { type: Type.STRING, description: "City, Country" },
        bio: { type: Type.STRING, description: "Short inspiring bio (2 sentences)" },
        expertise: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 skills" }
      },
      required: ["id", "name", "role", "company", "location", "bio", "expertise"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a professional networking assistant. You connect students with inspiring mentors."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return cleanAndParseJson<Mentor[]>(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
