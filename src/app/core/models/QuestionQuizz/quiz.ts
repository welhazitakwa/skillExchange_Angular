import { Question } from 'src/app/core/models/QuestionQuizz/question';

export interface Quiz {
    id?: number;
    title: string;
    image: string;
    participationCourseId?: number;
    certificatId?: number;
    questions?: Question[];
  }
  