import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CartService,
  CartItem
} from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  // =========================
  // CART ITEMS
  // =========================

  cartItems: CartItem[] = [];

  // =========================
  // LOADING
  // =========================

  loading = true;

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private cartService: CartService
  ) {}

  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    // Ambil data cart langsung
    // supaya tidak perlu refresh
    this.cartItems =
      this.cartService.getCartItems();

    this.loading = false;

    // Dengarkan perubahan cart
    this.cartService.cartItems$.subscribe(
      items => {

        this.cartItems = [
          ...items
        ];

        this.loading = false;

      }
    );

  }

  // =========================
  // INCREASE QUANTITY
  // =========================

  increaseQuantity(
    productId: number
  ): void {

    this.cartService.increaseQuantity(
      productId
    );

  }

  // =========================
  // DECREASE QUANTITY
  // =========================

  decreaseQuantity(
    productId: number
  ): void {

    this.cartService.decreaseQuantity(
      productId
    );

  }

  // =========================
  // REMOVE PRODUCT
  // =========================

  removeFromCart(
    productId: number
  ): void {

    this.cartService.removeFromCart(
      productId
    );

  }

  // =========================
  // CLEAR CART
  // =========================

  clearCart(): void {

    // Tidak ada produk
    if (this.cartItems.length === 0) {
      return;
    }

    const confirmed =
      confirm(
        'Apakah kamu yakin ingin mengosongkan keranjang?'
      );

    if (!confirmed) {
      return;
    }

    // Hapus dari service
    // sekaligus localStorage
    this.cartService.clearCart();

    // Pastikan tampilan langsung kosong
    this.cartItems = [];

  }

  // =========================
  // TOTAL ITEMS
  // =========================

  get totalItems(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  }

  // =========================
  // TOTAL PRICE
  // =========================

  get totalPrice(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total +
        (
          item.product.price *
          item.quantity
        ),
      0
    );

  }

}
