import { Component, OnInit } from '@angular/core';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';

@Component({
  selector: 'app-all-cart-products',
  templateUrl: './all-cart-products.component.html',
  styleUrls: ['./all-cart-products.component.css']
})
export class AllCartProductsComponent implements OnInit{
cartproducts: CartProducts[] = [];
filteredcartP: CartProducts[] = [];
  // Search and filter properties
  searchText: string = '';
 
  statusFilter: string = '';
  minQuantity = 0;
  maxQuantity = 100;

  // Sorting properties
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(private cartproService: CartProductService) {}

  ngOnInit(){
    /*this.cartproService.getCartProducts().subscribe(
      data => this.cartproducts=data,
      erreur =>console.log("erreur"),
      ()=>console.log("le chargement des produits  est terminés ")
      
     );
     */
    this.cartproService.getCartProducts().subscribe(
      
       (response: CartProducts[]) => {
               this.cartproducts = response;
               this.filteredcartP = [...this.cartproducts];
              
               this.applyFilters();
               console.log(response);
             },
             (error) => {
               console.log(error);
             }
            
    );
}
applyFilters(): void {
  this.filteredcartP = this.cartproducts.filter((cp) => {
    // Search text filter (name or type)
    const matchesSearch =
      !this.searchText ||
      cp.product.productName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      cp.product.type.toLowerCase().includes(this.searchText.toLowerCase());

    // Quantity filter
    const matchesQuantity =
      cp.quantity >= this.minQuantity && cp.quantity <= this.maxQuantity;

    return matchesSearch && matchesQuantity;
  });


  this.sortData();
}
sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  private sortData(): void {
    this.filteredcartP.sort((a, b) => {
      let valueA: any = a[this.sortColumn as keyof CartProducts];
      let valueB: any = b[this.sortColumn as keyof CartProducts];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        // For boolean values (like verified status)
        valueA = valueA ? 1 : 0;
        valueB = valueB ? 1 : 0;
      }

      if (!valueA || !valueB) return 0;

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

}