import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  private subscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ProductDetailComponent: ngOnInit called');
    this.routeSubscription = this.route.params.subscribe(params => {
      console.log('ProductDetailComponent: Route params:', params);
      const id = parseInt(params['id'], 10);
      console.log('ProductDetailComponent: Parsed ID:', id);
      if (id && !isNaN(id)) {
        this.loadProduct(id);
      } else {
        console.error('ProductDetailComponent: Invalid product ID:', params['id']);
        this.error = 'Invalid product ID';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadProduct(id: number): void {
    console.log('ProductDetailComponent: Loading product with ID:', id);
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.subscription = this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        console.log('ProductDetailComponent: Product loaded successfully:', product);
        this.product = product;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('ProductDetailComponent: Error loading product:', error);
        console.error('ProductDetailComponent: Error status:', error?.status);
        console.error('ProductDetailComponent: Error message:', error?.message);
        this.error = 'Product not found';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
