import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly categories: Category[] = [
    { id: 'electronics', name: 'Electronics', description: 'Electronic devices and gadgets' },
    { id: 'furniture', name: 'Furniture', description: 'Home and office furniture' },
    { id: 'clothing', name: 'Clothing', description: 'Apparel and fashion items' },
    { id: 'books', name: 'Books', description: 'Books and educational materials' },
    { id: 'sports', name: 'Sports', description: 'Sports and fitness equipment' },
    { id: 'home', name: 'Home & Garden', description: 'Home improvement and garden supplies' },
    { id: 'beauty', name: 'Beauty & Health', description: 'Beauty and health products' },
    { id: 'toys', name: 'Toys & Games', description: 'Toys and gaming products' },
    { id: 'automotive', name: 'Automotive', description: 'Car parts and accessories' },
    { id: 'other', name: 'Other', description: 'Miscellaneous items' }
  ];

  constructor() {}

  getAllCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(cat => cat.id === id);
  }

  getCategoryByName(name: string): Category | undefined {
    return this.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
  }
}
