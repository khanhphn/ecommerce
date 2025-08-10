import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError, tap } from 'rxjs';
import { Product, CreateProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:5098/api/products';

  constructor(private readonly http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    console.log('ProductService: Making GET request to:', this.API_URL);
    return this.http.get<Product[]>(this.API_URL).pipe(
      tap(response => console.log('ProductService: Raw API response:', response)),
      timeout(10000), // 10 second timeout
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ProductService: HTTP Error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('ProductService: Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error('ProductService: Server-side error:', error.status, error.message);
      console.error('ProductService: Error body:', error.error);
    }
    return throwError(() => error);
  }

  getProduct(id: number): Observable<Product> {
    console.log('ProductService: Making GET request for product ID:', id, 'to:', `${this.API_URL}/${id}`);
    return this.http.get<Product>(`${this.API_URL}/${id}`).pipe(
      tap(response => console.log('ProductService: Single product API response:', response)),
      timeout(10000), // 10 second timeout
      catchError(this.handleError)
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/category/${category}`);
  }

  createProduct(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  createProductWithFile(product: any, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('stockQuantity', product.stockQuantity.toString());
    formData.append('category', product.category);
    formData.append('image', file);
    
    return this.http.post<Product>(`${this.API_URL}/upload`, formData).pipe(
      tap(response => console.log('ProductService: Product created with file:', response)),
      timeout(30000), // 30 second timeout for file upload
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: Partial<CreateProduct>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
