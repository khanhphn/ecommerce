import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = true;
  private subscription?: Subscription;

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
