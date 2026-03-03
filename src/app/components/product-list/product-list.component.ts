import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  // ── table data ──
  productList: Product[] = [];

  // ── form fields ──
  productName = '';
  productDescription = '';
  productPrice: number | null = null;
  productStock: number | null = null;

  // ── edit state ──
  isEditMode = false;
  editingProductId: number | null = null;

  // ── subscription management ──
  private productSubscription!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productSubscription = this.productService.getAllProducts().subscribe(
      (products: Product[]) => {
        this.productList = products;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  // ── ADD ──
  onAddProduct(): void {
    if (!this.productName.trim()) return;

    this.productService.addProduct({
      name: this.productName.trim(),
      description: this.productDescription.trim(),
      price: this.productPrice ?? 0,
      stock: this.productStock ?? 0
    }).subscribe(() => this.resetForm());
  }

  // ── EDIT (populate form) ──
  onEditProduct(product: Product): void {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.productName = product.name;
    this.productDescription = product.description;
    this.productPrice = product.price;
    this.productStock = product.stock;
  }

  // ── UPDATE ──
  onUpdateProduct(): void {
    if (this.editingProductId === null) return;

    this.productService.updateProduct(this.editingProductId, {
      name: this.productName.trim(),
      description: this.productDescription.trim(),
      price: this.productPrice ?? 0,
      stock: this.productStock ?? 0
    }).subscribe(() => this.resetForm());
  }

  // ── DELETE ──
  onDeleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.deleteProduct(productId).subscribe();
  }

  // ── FORM SUBMIT (add or update depending on mode) ──
  onSubmit(): void {
    if (this.isEditMode) {
      this.onUpdateProduct();
    } else {
      this.onAddProduct();
    }
  }

  // ── CANCEL / RESET ──
  resetForm(): void {
    this.productName = '';
    this.productDescription = '';
    this.productPrice = null;
    this.productStock = null;
    this.isEditMode = false;
    this.editingProductId = null;
  }
}
