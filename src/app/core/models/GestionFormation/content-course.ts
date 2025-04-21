import { Formation } from "./formation";

export class ContentCourse {
  id!: number;
  title!: string;
  description!: string;
  contentType!: string;
  order!: number;
  lnk_vid!: string;
  course!: Formation;
  
}
