interface ParsedPrompt {
  enhancedPrompt: string;
  negativePrompt: string;
}

export class ResponseParser {
  static parseJSON(text: string): ParsedPrompt {
    try {
      // Try to find a JSON object in the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      if (!result.enhancedPrompt || !result.negativePrompt) {
        throw new Error('Invalid response format');
      }

      return {
        enhancedPrompt: result.enhancedPrompt,
        negativePrompt: result.negativePrompt
      };
    } catch (error) {
      // Fallback to regex parsing if JSON parsing fails
      const enhancedMatch = text.match(/"enhancedPrompt":\s*"([^"]+)"/);
      const negativeMatch = text.match(/"negativePrompt":\s*"([^"]+)"/);

      if (!enhancedMatch) {
        throw new Error('Could not extract enhanced prompt from response');
      }

      return {
        enhancedPrompt: enhancedMatch[1],
        negativePrompt: negativeMatch?.[1] || 'blurry, low quality, distorted, deformed, ugly, bad anatomy'
      };
    }
  }
}