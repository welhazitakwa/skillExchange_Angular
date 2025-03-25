import { Product } from "./product";

export class Cart {
    id!: number;
    quantity!: number;
    idUser!: number;
   products!: Product[];
  
}
