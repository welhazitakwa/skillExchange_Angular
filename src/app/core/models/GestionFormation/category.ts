export class Category {
  id!: number;
  image!: string; // image encodée en base64
  imageType!: string; // type MIME de l'image, ex: 'image/png'
  name!: string;
  status!: number;
  description!: string;
  date_ajout!: Date;
  courseCount!: number;
}
