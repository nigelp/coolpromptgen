import { AIModel } from '../types';

const styleKeywords = [
  'photorealistic', 'oil painting', 'watercolor', 'digital art',
  'pencil sketch', '3D render', 'cinematic', 'studio photography'
];

const lightingKeywords = [
  'natural light', 'golden hour', 'dramatic lighting', 'soft light',
  'high contrast', 'moody', 'backlit', 'rim light'
];

const compositionKeywords = [
  'rule of thirds', 'centered composition', 'dynamic angle',
  'close-up', 'wide shot', 'symmetrical', 'leading lines'
];

export const enhancePrompt = (basePrompt: string): string => {
  const components = analyzePrompt(basePrompt);
  return constructEnhancedPrompt(components);
};

const analyzePrompt = (prompt: string) => {
  // Basic analysis of the core subject and intended style
  const words = prompt.toLowerCase().split(' ');
  const hasStyle = styleKeywords.some(style => prompt.toLowerCase().includes(style));
  const hasLighting = lightingKeywords.some(light => prompt.toLowerCase().includes(light));
  const hasComposition = compositionKeywords.some(comp => prompt.toLowerCase().includes(comp));

  return {
    subject: prompt,
    needsStyle: !hasStyle,
    needsLighting: !hasLighting,
    needsComposition: !hasComposition
  };
};

const constructEnhancedPrompt = (components: any): string => {
  let enhancedPrompt = components.subject;

  if (components.needsStyle) {
    enhancedPrompt += ', photorealistic style with attention to detail';
  }

  if (components.needsLighting) {
    enhancedPrompt += ', natural lighting with soft shadows';
  }

  if (components.needsComposition) {
    enhancedPrompt += ', balanced composition with rule of thirds';
  }

  return enhancedPrompt;
};

export const generateNegativePrompt = (): string => {
  return 'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, signature, out of frame';
};