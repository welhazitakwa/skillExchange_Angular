import { User } from "../GestionUser/User";
import { Quiz } from 'src/app/core/models/QuestionQuizz/quiz';
import { Category } from "./category";

export class Formation {
  id!: number;
  image!: string;
  imageType!: string;
  title!: string;
  description!: string;
  duration!: number;
  requiredSkills!: string;
  state!: number;
  price!: number;
  approoved!: number;
  date_ajout!: Date;
  category!: Category;
  author!: User;
  quiz!: Quiz;
}
