export enum AppState {
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  RECORDING = 'RECORDING',
  ANALYZING = 'ANALYZING',
  FEEDBACK = 'FEEDBACK',
  ERROR = 'ERROR'
}

export interface Topic {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  promptContext: string;
}

export interface AnalysisResult {
  transcription: string;
  feedback: {
    grammar: string;
    vocabulary: string;
    pronunciation: string;
    fluency: string;
    adequacy: string;
  };
  generalFeedback: string;
  scaffolding: string[]; // List of useful phrases/vocabulary
  score: number; // 0-100 estimate
}

export interface AudioState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  duration: number;
}
