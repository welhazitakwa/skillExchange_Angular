import { Quiz } from "../QuestionQuizz/quiz";
import { Formation } from "./formation";

export class ParticipationFormation {
  idp!: number;
  progress!: number;
  participant!: number;
  date_participation!: Date;
  course!: Formation;
  quiz!: Quiz;
}
