import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  // ── seed data ──
  private initialProducts: Product[] = [
    { id: 1, name: 'Wireless Mouse',      description: 'Ergonomic bluetooth mouse',    price: 24.99,  stock: 40 },
    { id: 2, name: 'Mechanical Keyboard',  description: 'Cherry MX blue switches',      price: 74.99,  stock: 15 },
    { id: 3, name: 'USB-C Hub',            description: '7-in-1 multi-port adapter',     price: 39.99,  stock: 22 },
  ];

  // ── RxJS state holder ──
  private productListSubject = new BehaviorSubject<Product[]>(this.initialProducts);
  private nextId = 4;

  // ── READ (observable) ──
  getAllProducts(): Observable<Product[]> {
    return this.productListSubject.asObservable();
  }

  getProductById(productId: number): Observable<Product | undefined> {
    return this.productListSubject.pipe(
      map(products => products.find(p => p.id === productId))
    );
  }

  // ── CREATE ──
  addProduct(newProduct: Omit<Product, 'id'>): Observable<Product> {
    const created: Product = { ...newProduct, id: this.nextId++ };
    const currentList = this.productListSubject.getValue();
    this.productListSubject.next([...currentList, created]);
    return of(created);
  }

  // ── UPDATE ──
  updateProduct(productId: number, changes: Partial<Product>): Observable<Product | undefined> {
    const currentList = this.productListSubject.getValue();
    const updatedList = currentList.map(item =>
      item.id === productId ? { ...item, ...changes, id: productId } : item
    );
    this.productListSubject.next(updatedList);
    return of(updatedList.find(p => p.id === productId));
  }

  // ── DELETE ──
  deleteProduct(productId: number): Observable<boolean> {
    const currentList = this.productListSubject.getValue();
    const filteredList = currentList.filter(p => p.id !== productId);
    this.productListSubject.next(filteredList);
    return of(true);
  }
}
