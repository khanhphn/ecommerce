import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  loading = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cartService.cart$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });

    // Redirect to login if not authenticated
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFinalTotal(): number {
    const subtotal = this.cartService.totalPrice;
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.085;
    return subtotal + shipping + tax;
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.loading = true;
      
      const shippingAddress = `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}, ${this.checkoutForm.value.address}, ${this.checkoutForm.value.city}, ${this.checkoutForm.value.state} ${this.checkoutForm.value.zipCode}`;
      
      const orderData = {
        shippingAddress,
        orderItems: this.cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          // Clear cart after successful order
          this.cartService.clearCart();
          
          // Redirect to order confirmation
          this.router.navigate(['/orders', order.id]);
        },
        error: (error) => {
          console.error('Order creation failed:', error);
          alert('Failed to place order. Please try again.');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
    }
  }
}
