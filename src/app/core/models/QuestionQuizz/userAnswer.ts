export interface UserAnswer {
  question: { id: number };
  participationCourse: { idp: number };
  quiz: { id: number };
  userAnswer: string;
}