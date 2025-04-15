import { Component } from '@angular/core';
import { Product } from 'src/app/core/models/GestionProduit/product';
import { ProductService } from 'src/app/core/services/GestionProduit/product.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent {
products: Product[] = [];
filteredproduct: Product[] = [];
  // Search and filter properties
  searchText: string = '';
 
  statusFilter: string = '';
  sellerFilter: string = '';  // Vendeur
  stockFilter: string = '';   // Stock
  uniqueSellers: string[] = [];  // Liste des vendeurs uniques
  

  // Sorting properties
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private productService: ProductService) {}

  ngOnInit(){
    this.productService.getProduct().subscribe(
      /*data => this.products=data,
      erreur =>console.log("erreur"),
      ()=>console.log("le chargement des produits  est terminés ")
      
     );*/
     (response: Product[]) => {
                    this.products = response;
                    this.filteredproduct = [...this.products];
                    this.extractUniqueSellers();  // Extraire les vendeurs uniques
                    this.applyFilters(); 
                    console.log(response);
                  },
                  (error) => {
                    console.log(error);
                  }
         );
  }
  

// Extraire les vendeurs uniques
private extractUniqueSellers(): void {
  this.uniqueSellers = Array.from(new Set(
    this.products.map(product => product.postedBy!.name) // Remplacer 'name' par la propriété que vous souhaitez
  ));}
  applyFilters(): void {
    this.filteredproduct = this.products.filter((p) => {
      // Search text filter (name or email)
      const matchesSearch =
        !this.searchText ||
        p.productName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.type.toLowerCase().includes(this.searchText.toLowerCase());
  
     
  
      return matchesSearch ;
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
      this.filteredproduct.sort((a, b) => {
        let valueA: any = a[this.sortColumn as keyof Product];
        let valueB: any = b[this.sortColumn as keyof Product];
        
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
