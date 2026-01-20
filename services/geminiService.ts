import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
// Always use the named parameter 'apiKey' and use process.env.API_KEY directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAgentAnalysis = async (agentName: string, role: string, description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    // Use gemini-3-flash-preview for basic text analysis tasks.
    model: 'gemini-3-flash-preview',
    contents: `Analyze this AI Agent and suggest 3 high-impact optimization strategies. 
    Agent Name: ${agentName}
    Role: ${role}
    Description: ${description}`,
    config: {
        thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text;
};

export const getDeepThinkingInsights = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    // Use gemini-3-pro-preview for complex reasoning and deep thinking tasks.
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};

export const generateAgentReport = async (agent: any) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        // Updated model name to gemini-3-flash-preview.
        model: 'gemini-3-flash-preview',
        contents: `Create a brief markdown report for the status of Agent ${agent.name}. Current status: ${agent.status}. Tokens: ${agent.tokensUsed}.`,
        config: {
            // Google Search grounding for up-to-date information.
            tools: [{ googleSearch: {} }]
        }
    });
    return {
        text: response.text,
        // Extract grounding chunks to display potential source references.
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const speakAgentStatus = async (text: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        // Model for text-to-speech tasks.
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    // Decode base64 PCM data into an AudioBuffer for playback.
    const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        outputAudioContext,
        24000,
        1,
    );
    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();
};

// Implementation of manual base64 decoding.
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Implementation of manual AudioBuffer creation from raw PCM data.
async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}