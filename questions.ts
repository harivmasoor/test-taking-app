export interface Choice {
    id: string; // A, B, C, D
    text: string;
  }
  
  export interface Question {
    id: string;
    text: string;
    choices: Choice[];
    correctAnswer: string;
    chapter: string;
    section: string;
  }