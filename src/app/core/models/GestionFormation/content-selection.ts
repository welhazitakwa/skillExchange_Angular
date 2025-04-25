import { User } from "../GestionUser/User";
import { ContentCourse } from "./content-course";
import { Formation } from "./formation";

export class ContentSelection {
  id!: number;
  isChecked!: boolean;
  courseContent!: ContentCourse;
  date_participation!: Date;
}
