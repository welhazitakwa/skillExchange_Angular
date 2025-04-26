export interface Result {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  certificat?: any; // Add if you need to handle certificates
}