import { User } from "../GestionUser/User";

export class Formation {
  id!: number;//
  image!: string;//
  imageType!: string;//
  title!: string;//
  description!: string;//
  duration!: Float32Array;//
  requiredSkills!: string; //
  state!: number;//
  price!:number ;//
  date_ajout!: Date;
  category_id!: number;
  author!: User;
}
