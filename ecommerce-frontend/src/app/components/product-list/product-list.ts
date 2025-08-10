import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService, Category } from '../../services/category.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  private subscription?: Subscription;
  selectedCategoryFilter = '';
  
  // Admin functionality
  showAddProductModal = false;
  addProductForm: FormGroup;
  isCreatingProduct = false;
  selectedFile: File | null = null;
  categories: Category[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly categoryService: CategoryService
  ) {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProducts(): void {
    // Clean up existing subscription first
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    
    this.loading = true;
    this.cdr.detectChanges(); // Force UI update for loading state
    
    this.subscription = this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        // Ensure we have a valid array
        if (Array.isArray(products)) {
          this.products = products;
        } else {
          this.products = products ? [products] : [];
        }
        
        this.applyFilter();
        this.loading = false;
        
        // Force change detection for zoneless Angular
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  // Admin functionality
  openAddProductModal(): void {
    this.showAddProductModal = true;
    this.addProductForm.reset();
    this.cdr.detectChanges();
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
    this.addProductForm.reset();
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  onSubmitProduct(): void {
    if (this.addProductForm.valid && !this.isCreatingProduct && this.selectedFile) {
      this.isCreatingProduct = true;
      this.cdr.detectChanges();

      const productData = this.addProductForm.value;
      
      this.productService.createProductWithFile(productData, this.selectedFile).subscribe({
        next: (newProduct: Product) => {
          console.log('Product created successfully:', newProduct);
          this.products.unshift(newProduct); // Add to beginning of list
          this.applyFilter(); // Update filtered products
          this.closeAddProductModal();
          this.isCreatingProduct = false;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error creating product:', error);
          this.isCreatingProduct = false;
          this.cdr.detectChanges();
          alert('Failed to create product. Please try again.');
        }
      });
    } else if (!this.selectedFile) {
      alert('Please select an image file.');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
        input.value = '';
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB.');
        input.value = '';
        return;
      }
      
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    
    // If it's already a full URL, return it
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path from our API, prepend the API base URL
    return `http://localhost:5098${imageUrl}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
  }

  applyFilter(): void {
    if (!this.selectedCategoryFilter) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.category.toLowerCase() === this.selectedCategoryFilter.toLowerCase()
      );
    }
    this.cdr.detectChanges();
  }

  filterByCategory(categoryName: string): void {
    this.selectedCategoryFilter = categoryName;
    this.applyFilter();
  }

  clearFilter(): void {
    this.selectedCategoryFilter = '';
    this.applyFilter();
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.products = this.products.filter(p => p.id !== productId);
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }
}
