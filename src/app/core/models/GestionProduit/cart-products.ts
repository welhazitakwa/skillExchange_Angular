import { Cart } from "./cart";
import { Product } from "./product";

export class CartProducts {
    id!:number;
    cart!: Cart;
    product!: Product;
    quantity!:number;
}
