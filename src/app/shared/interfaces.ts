export type Sentence = {
  [key: number]: string;
};

export type PreppedSentence = [number, string, boolean];

export type PreppedSentencesList = Array<PreppedSentence>;

export type IncomingMessage = {
  [key: string]: Sentence | string;
};

export type RecognitionStatus = {
  [key: string]: string;
};

export type InferenceData = {
  [key: string]: string;
};

export type Settings = {
  darkTheme: boolean;
  initLoadLastNMinutes: number;
  mainPrompt: string;
};
