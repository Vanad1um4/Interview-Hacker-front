export type Sentence = {
  [key: number]: string;
};

export type IncomingMessage = {
  [key: string]: Sentence | string;
};

export type RecognitionStatus = {
  [key: string]: string;
};
