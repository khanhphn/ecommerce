import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterModule, DatePipe, TitleCasePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private readonly orderService: OrderService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    console.log('OrdersComponent: loadOrders called');
    console.log('OrdersComponent: User authenticated:', this.authService.isAuthenticated);
    console.log('OrdersComponent: Current user:', this.authService.currentUser);
    console.log('OrdersComponent: Token available:', !!this.authService.token);
    
    if (!this.authService.isAuthenticated) {
      console.log('OrdersComponent: User not authenticated, showing error');
      this.loading = false;
      this.error = 'Please log in to view your orders';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    console.log('OrdersComponent: Making API call to get user orders');
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        console.log('OrdersComponent: Orders loaded successfully:', orders);
        console.log('OrdersComponent: Number of orders:', orders.length);
        this.orders = orders;
        this.loading = false;
        this.error = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('OrdersComponent: Failed to load orders:', error);
        console.error('OrdersComponent: Error status:', error?.status);
        console.error('OrdersComponent: Error message:', error?.message);
        this.loading = false;
        this.error = error?.status === 401 ? 'Authentication failed. Please log in again.' : 'Failed to load orders. Please try again.';
        this.orders = [];
        this.cdr.detectChanges();
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'processing':
        return 'bg-info text-white';
      case 'shipped':
        return 'bg-primary text-white';
      case 'delivered':
        return 'bg-success text-white';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  viewOrderDetails(orderId: number) {
    // Navigate to order details page or show modal
    console.log('View order details for order:', orderId);
  }

  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateOrderStatus(orderId, 'cancelled').subscribe({
        next: () => {
          console.log('OrdersComponent: Order cancelled successfully');
          // Reload orders to show updated status
          this.loadOrders();
        },
        error: (error) => {
          console.error('OrdersComponent: Failed to cancel order:', error);
          alert('Failed to cancel order. Please try again.');
        }
      });
    }
  }
}
