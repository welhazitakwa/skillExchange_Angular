import { Question } from 'src/app/core/models/QuestionQuizz/question';
import { Formation } from '../GestionFormation/formation';

export interface Quiz {
  id?: number;
  title?: string;
  image?: string;  // Now properly defined
  participationCourseId?: number;
  certificatId?: number;
  questions?: Question[];
  courses?: Formation[];

  }
  