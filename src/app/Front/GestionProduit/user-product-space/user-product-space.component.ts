import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/GestionProduit/product';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { ImageProductService } from 'src/app/core/services/GestionProduit/image-product.service';
import { ProductService } from 'src/app/core/services/GestionProduit/product.service';
import { AiProductService } from 'src/app/core/services/GestionProduit/ProductIA/ai-product.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-product-space',
  templateUrl: './user-product-space.component.html',
  styleUrls: ['./user-product-space.component.css']
})
export class UserProductSpaceComponent implements OnInit{
  productsByUser: Product[] = [];
  
currentUser: User | null = null;
  constructor(private aiProductService: AiProductService,private imageProductService: ImageProductService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router, private productService:ProductService, private fb: FormBuilder
  ) {
      this.addProductForm = this.fb.group({
          productName: ['', [Validators.required, Validators.maxLength(50)]],
          type: ['', Validators.required],
          price: [null, [Validators.required, Validators.min(0)]],
          currencyType: ['TND', Validators.required],
          stock: [null, [Validators.required, Validators.min(0)]],
          images: [null]  
        });
  }
  ngOnInit(): void {
    this.loadCurrentUser();
    this.updatePagination();
  }


  getMyProducts() {
    if (!this.currentUser) {
      console.error("No current user loaded");
      return;
    }
    
    this.productService.getProductsByUser(this.currentUser.id).subscribe({
      next: (products) => {
        this.productsByUser = products;
        this.updatePagination();

        console.log("✅ My Products:", products);
      },
      error: (err) => {
        console.error("❌ Failed to fetch my products:", err);
      }
    });
  }
 
private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    console.log(currentUserEmail);
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
        console.log('✅ Current user loaded:', this.currentUser);
        this.getMyProducts();  
      },
      (error) => {
        console.error(error);
      }
    );
  }
  selectedImages: string[] = [];
onFilesSelected(event: any) {
  const files: FileList = event.target.files;
  if (!files) return;

  Array.from(files).forEach((file: File) => {
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      alert(`Le fichier ${file.name} n'est pas une image valide (JPEG/PNG requis)`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(`L'image ${file.name} est trop volumineuse (5MB maximum)`);
      return;
    }

    this.resizeImage(file, 800, 600).then((resizedFile) => {
      this.selectedFiles.push(resizedFile);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        const base64Data = base64String.split(',')[1];

        this.imagesPreviews.push({
          url: base64String,
          file: resizedFile
        });

        this.selectedImages.push(base64Data); 
      };

      reader.readAsDataURL(resizedFile);
    }).catch(error => {
      console.error('Erreur lors du redimensionnement de l\'image :', error);
    });
  });
}

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = (e) => {
        img.src = e.target!.result as string;
  
        img.onload = () => {
          let width = img.width;
          let height = img.height;
  
         
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
  
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
  
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject('Erreur lors du redimensionnement de l\'image');
            }
          }, file.type);
        };
      };
  
      reader.readAsDataURL(file);
    });
  }
  currentImages: string[] = []; 


  //////////////EDIT/////////////////////////////////
  isSubmitting: boolean = false;
  editingProduct?: Product;
  imagesToDelete: number[] = []; 
  selectedFiles: File[]=[]
  imagesPreviews: { url: string, file: File | null }[] = [];
  editImagesPreviews: any;
    
  showModalProduct = false;
  startEditProduct(product: Product) {
    this.editingProduct = JSON.parse(JSON.stringify(product)); 
    this.imagesToDelete = [];
    this.selectedFiles = [];
    this.updateImagePreviews();
    this.showModalProduct = true;
  }
  private updateImagePreviews(): void {
    this.imagesPreviews = [];
  
    const existingImages = (this.editingProduct?.imageProducts || [])
      .filter(img => !this.imagesToDelete.includes(img.idImage || -1)) 
      .map(img => ({
        url: 'data:image/jpeg;base64,' + img.image,
        file: null
      }));
  
    const newImagePreviews = this.selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
  
    this.imagesPreviews = [...existingImages, ...newImagePreviews];
  }
  submitEditProduct() {
    if (!this.editingProduct) return;
    if (
      !this.editingProduct.productName?.trim() ||
      !this.editingProduct.type?.trim() ||
      !this.editingProduct.currencyType?.trim() ||
      this.editingProduct.price == null || this.editingProduct.price <= 0 ||
      this.editingProduct.stock == null || this.editingProduct.stock < 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all the fields correctly before saving!'
      });
      return;
    }
  
    const newImages = this.selectedImages.map(base64 => ({
      image: base64
    }));
  
   
    this.editingProduct.imageProducts = this.editingProduct.imageProducts || [];
  
    if (this.imagesToDelete.length > 0) {
      this.imagesToDelete.forEach(id => {
        this.imageProductService.deleteImageProduct(id).subscribe({
          next: () => console.log(`🗑️ Image ${id} supprimée côté serveur.`),
          
          error: err => console.error('❌ Échec suppression image:', err)
        });
      });
    }
    
    this.editingProduct.imageProducts = [
      ...this.editingProduct.imageProducts,
      ...newImages
    ];
  
    this.productService.updateProduct(this.editingProduct).subscribe({
      next: () => {
        console.log('✅ Produit mis à jour');
        this.afterProductUpdate();
      },
      error: (error) => {
        console.error('❌ Erreur lors de la mise à jour du produit', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Something went wrong while updating.'
        });
      }
    });
  }
  private loadProducts(){
    this.productService.getApprovedProducts().subscribe(
      (products) => {
    
      
        this.products = products.filter(p => p.postedBy?.id !== this.currentUser?.id);
        
        this.filterProducts();
       
        console.log(this.products); 
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }
   private afterProductUpdate() {
      this.loadProducts(); 
      this.resetEditForm();
      this.showModalProduct = false;
      this.getMyProducts();
      this.imagesToDelete = [];

      Swal.fire({
        icon: 'success',
        title: 'Product updated!',
        showConfirmButton: false,
        timer: 1500
      });
    }
    private resetEditForm(): void {
      this.editImagesPreviews = [];
      this.selectedFiles = [];
      this.imagesToDelete = [];
    }
  cancelEditProduct() {
    this.showModalProduct = false;
  }
  /////////////////////DELETE ///////////////////
  products: Product[] = [];

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(
          () => {
            console.log('✅ Product deleted');
            this.getMyProducts(); 
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
          },
          (error) => {
            console.error('❌ Error deleting product', error);
            Swal.fire('Error!', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }
  
  
  /////////////////////////
  filteredProducts: Product[] = [];
  selectedType: string = '';
  filterProducts() {
    if (!this.selectedType || this.selectedType === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.type === this.selectedType);
    }
    this.currentPage = 1;
this.updatePagination();

  }
  currentPage: number = 1;
pageSize: number = 8;
totalPages: number = 1;
updatePagination(): void {
  this.totalPages = Math.ceil(this.productsByUser.length / this.pageSize);
  this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
}

get paginatedProducts(): any[] {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.productsByUser.slice(start, end);
}

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

get pageNumbers(): number[] {
  const pages: number[] = [];
  for (let i = 1; i <= this.totalPages; i++) {
    pages.push(i);
  }
  return pages;
}
///////////////////////////ADD//////////////////////////
showModalProductAdd = false;
  addProductForm: FormGroup;
  async submitNewProduct() {
      if (this.addProductForm.invalid) {
        this.addProductForm.markAllAsTouched();
        return;
      }
  
      if (!this.currentUser) {
        alert('You must be connected');
        return;
      }
  
      try {
        const formValues = this.addProductForm.value;
  
        const imageProducts = await Promise.all(
          this.selectedFiles.map(async file => ({
            image: await this.getBase64WithoutPrefix(file),
          }))
        );
  
        const productToSend = {
          productName: formValues.productName,
          type: formValues.type,
          price: formValues.price,
          currencyType: formValues.currencyType,
          stock: formValues.stock,
          postedBy: { id: this.currentUser.id },
          imageProducts: imageProducts
        };
  
        this.productService.addProduct(productToSend as Product).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Product added!',
              showConfirmButton: false,
              timer: 1500
            });
            this.showModalProductAdd = false;
            this.getMyProducts();
          },
          error: (err) => {
            console.error('Erreur complète:', err);
            alert(`Erreur: ${err.error?.message || 'See console'}`);
          }
        });
  
      } catch (error) {
        console.error('Erreur de traitement des images:', error);
        alert('Erreur de traitement des images');
      }
    }
  
    private async getBase64WithoutPrefix(file: File): Promise<string> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => resolve(e.target.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
    }
  
    switchMainImage(product: Product, index: number) {
      if (product.imageProducts && product.imageProducts.length > index) {
        
        [product.imageProducts[0], product.imageProducts[index]] = 
        [product.imageProducts[index], product.imageProducts[0]];
      }
    }
    markImageForDeletion(index: number): void {
      if (!this.imagesToDelete.includes(index)) {
        this.imagesToDelete.push(index);
        this.updateImagePreviews();
      }
    }
   
    removeImage(index: number): void {
      const img = this.editingProduct?.imageProducts[index];
    
     
      if (img?.idImage && !this.imagesToDelete.includes(img.idImage)) {
        this.imagesToDelete.push(img.idImage);
      }
    
      
      if (this.editingProduct?.imageProducts) {
        this.editingProduct.imageProducts.splice(index, 1);
      }
    
      
      this.updateImagePreviews();
    }
    
    
    imageError: string | null = null;
    onFileChange(event: any): void {
    const files = event.target.files;
    this.imageError = null;
    this.imagesPreviews = []; 
    this.selectedImages = []; 
  
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          this.imageError = 'Only image files are allowed.';
          return; 
        }
  
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result;
          this.imagesPreviews.push(base64String);  
          const base64Data = base64String.split(',')[1];
          this.selectedImages.push(base64Data);  
        };
        reader.readAsDataURL(file);
      }
    }
  }
  /////////////////////////////////////////////IA////////////////////////////////////////////////////////
isAnalyzing: boolean = false;
suggestedLabels: string[] = [];

async analyzeImages() {
  if (this.selectedFiles.length === 0) {
    alert('Please select at least one image.');
    return;
  }

  this.isAnalyzing = true;

  try {
    const response: any = await this.aiProductService.analyzeProduct(this.selectedFiles).toPromise();

    this.suggestedLabels = response.productLabels || [];

    this.newProduct.productName = response.productName;
    this.newProduct.type = response.type;
    this.newProduct.price = response.price;
    this.newProduct.currencyType = response.currencyType;
    this.newProduct.stock = response.stock;
    

    console.log('✅ Analyse IA réussie');
  } catch (error) {
    console.error('❌ Erreur analyse IA:', error);
  } finally {
    this.isAnalyzing = false;
  }
}
newProduct: Product = new Product();
onLabelChange(event: any) {
  const selectedLabel = event.target.value;
  
 
  this.newProduct.productName = selectedLabel;
  this.addProductForm.get('productName')?.setValue(selectedLabel);

  const labelLower = selectedLabel.toLowerCase();

  if (labelLower.includes('phone') || labelLower.includes('laptop') || labelLower.includes('tablet') || labelLower.includes('tv') || labelLower.includes('camera')) {
   
    this.newProduct.type = "PHYSICAL";
    this.newProduct.price = 1000;
    this.newProduct.currencyType = "TND";
    this.addProductForm.get('type')?.setValue('PHYSICAL');
    this.addProductForm.get('price')?.setValue(1000);
    this.addProductForm.get('currencyType')?.setValue('TND');
  } else if (labelLower.includes('software') || labelLower.includes('application') || labelLower.includes('program') || labelLower.includes('app') || labelLower.includes('ebook') || labelLower.includes('music') || labelLower.includes('game')) {

    this.newProduct.type = "DIGITAL";
    this.newProduct.price = 50;
    this.newProduct.currencyType = "TOKENS";  


    this.addProductForm.get('type')?.setValue('DIGITAL');
    this.addProductForm.get('price')?.setValue(50);
    this.addProductForm.get('currencyType')?.setValue('TOKENS');
  } else {
    
    this.newProduct.type = "PHYSICAL";
    this.newProduct.price = 100;
    this.newProduct.currencyType = "TND";
    this.addProductForm.get('type')?.setValue('PHYSICAL');
    this.addProductForm.get('price')?.setValue(100);
    this.addProductForm.get('currencyType')?.setValue('TND');
  }
}

}
