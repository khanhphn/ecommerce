import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  constructor(
    public readonly authService: AuthService,
    public readonly cartService: CartService,
    private readonly router: Router
  ) {}

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      // Clear the cart when logging out
      this.cartService.clearCart();
      
      // Logout from auth service
      this.authService.logout();
      
      // Navigate to home page
      this.router.navigate(['/products']);
    }
  }
}
