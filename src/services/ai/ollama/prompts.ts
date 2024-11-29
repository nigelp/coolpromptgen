export const SYSTEM_PROMPT = `You are an expert at improving image generation prompts. Format your responses as valid JSON objects with "enhancedPrompt" and "negativePrompt" fields.`;

export const createPromptRequest = (basePrompt: string) => `Enhance this prompt: "${basePrompt}"

Create two things:
1. An enhanced version that includes:
   - Specific descriptive details about the subject
   - Appropriate artistic style and medium
   - Lighting and atmosphere specifications
   - Composition elements
   - Technical parameters
   - Natural language flow

2. A negative prompt that helps avoid common issues

Format your response exactly like this:
{
  "enhancedPrompt": "a majestic lion, detailed fur texture, dramatic lighting with golden hour glow, professional wildlife photography, sharp focus, ultra HD quality, rule of thirds composition",
  "negativePrompt": "blurry, oversaturated, low quality, distorted features, unrealistic anatomy, overexposed"
}`;