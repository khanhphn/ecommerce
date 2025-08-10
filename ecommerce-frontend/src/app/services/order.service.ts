import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, timeout } from 'rxjs';
import { Order, CreateOrder } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'http://localhost:5098/api/orders';

  constructor(private readonly http: HttpClient) {}

  createOrder(order: CreateOrder): Observable<Order> {
    console.log('OrderService: Creating order:', order);
    return this.http.post<Order>(this.API_URL, order).pipe(
      tap(response => console.log('OrderService: Order created successfully:', response)),
      timeout(10000)
    );
  }

  getUserOrders(): Observable<Order[]> {
    console.log('OrderService: Getting user orders from:', this.API_URL);
    return this.http.get<Order[]>(this.API_URL).pipe(
      tap(response => {
        console.log('OrderService: User orders response:', response);
        console.log('OrderService: Number of orders:', response?.length || 0);
      }),
      timeout(10000)
    );
  }

  getOrder(id: number): Observable<Order> {
    console.log('OrderService: Getting order with ID:', id);
    return this.http.get<Order>(`${this.API_URL}/${id}`).pipe(
      tap(response => console.log('OrderService: Order response:', response)),
      timeout(10000)
    );
  }

  updateOrderStatus(id: number, status: string): Observable<void> {
    console.log('OrderService: Updating order status:', id, 'to:', status);
    return this.http.patch<void>(`${this.API_URL}/${id}/status`, { status }).pipe(
      tap(() => console.log('OrderService: Order status updated successfully')),
      timeout(10000)
    );
  }
}
