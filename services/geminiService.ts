import { GoogleGenAI } from "@google/genai";
import { Investor, PipelineStats } from "../types";
import { CURRENT_DATE } from "../constants";

const getGeminiClient = () => {
    // In a real app, strict error handling for missing key
    if (!process.env.API_KEY) {
        console.warn("API Key is missing.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateFundraisingReport = async (
    investors: Investor[],
    stats: PipelineStats
): Promise<string> => {
    const ai = getGeminiClient();
    if (!ai) return "API Key가 설정되지 않았습니다.";

    const prompt = `
    You are a fundraising assistant for a Korean startup called Glorang (글로랑).
    Current Date: ${CURRENT_DATE}

    Analyze the following pipeline data and targets:
    
    Targets:
    - 1st Target: ${stats.targetPrimary}억 KRW
    - Final Target: ${stats.targetFinal}억 KRW
    
    Current Stats:
    - Verbal Commits: ${stats.totalVerbal}억
    - High Interest: ${stats.totalHighInterest}억
    - Weighted Expected Value: ${stats.weightedTotal.toFixed(1)}억
    
    Pipeline Details (JSON):
    ${JSON.stringify(investors, null, 2)}
    
    Please provide a concise strategic update in Korean adhering to this format:
    1. **Pipeline Summary**: Brief status of confirmed vs target.
    2. **Key Blockers**: Specifically mention the Fintech Thesis dependency if unresolved.
    3. **Recommended Actions**: Specific next steps for the CEO and Kyung-hoon.
    
    Keep it professional, concise, and action-oriented.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return response.text || "분석 결과를 생성할 수 없습니다.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
};
