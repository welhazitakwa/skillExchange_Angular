export interface Quiz {
  id: number;
}

export interface Question {
  id?: number;
  question: string;
  reponse: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  quiz: Quiz; 
}
