import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Book } from '../models/book';

export interface CartItem {
  product: Book;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // =========================
  // LOCAL STORAGE KEY
  // =========================

  private readonly CART_KEY =
    'book_catalog_cart';

  // =========================
  // CART STATE
  // =========================

  private cartItemsSubject =
    new BehaviorSubject<CartItem[]>(
      this.loadCart()
    );

  cartItems$ =
    this.cartItemsSubject.asObservable();

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor() {

    // Dengarkan perubahan localStorage
    // dari tab browser lain
    window.addEventListener(
      'storage',
      (event: StorageEvent) => {

        // Hanya proses perubahan
        // untuk cart kita
        if (
          event.key !== this.CART_KEY
        ) {
          return;
        }

        // =====================
        // CART DIHAPUS
        // =====================

        if (
          event.newValue === null
        ) {

          this.cartItemsSubject.next([]);

          return;

        }

        // =====================
        // CART BERUBAH
        // =====================

        try {

          const updatedCart =
            JSON.parse(
              event.newValue
            ) as CartItem[];

          this.cartItemsSubject.next(
            updatedCart
          );

        } catch (error) {

          console.error(
            'Gagal membaca perubahan cart:',
            error
          );

        }

      }
    );

  }

  // =========================
  // LOAD CART
  // =========================

  private loadCart(): CartItem[] {

    const savedCart =
      localStorage.getItem(
        this.CART_KEY
      );

    if (!savedCart) {

      return [];

    }

    try {

      return JSON.parse(
        savedCart
      ) as CartItem[];

    } catch (error) {

      console.error(
        'Gagal membaca cart:',
        error
      );

      return [];

    }

  }

  // =========================
  // SAVE CART
  // =========================

  private saveCart(
    items: CartItem[]
  ): void {

    localStorage.setItem(
      this.CART_KEY,
      JSON.stringify(items)
    );

  }

  // =========================
  // GET CURRENT CART
  // =========================

  getCartItems(): CartItem[] {

    return this.cartItemsSubject.value;

  }

  // =========================
  // ADD TO CART
  // =========================

  addToCart(
    product: Book
  ): void {

    const currentItems =
      this.cartItemsSubject.value;

    const existingItem =
      currentItems.find(
        item =>
          item.product.id === product.id
      );

    // =====================
    // PRODUK SUDAH ADA
    // =====================

    if (existingItem) {

      existingItem.quantity++;

    }

    // =====================
    // PRODUK BARU
    // =====================

    else {

      currentItems.push({

        product: product,

        quantity: 1

      });

    }

    // =====================
    // UPDATE STATE
    // =====================

    const updatedItems = [
      ...currentItems
    ];

    this.cartItemsSubject.next(
      updatedItems
    );

    // =====================
    // SAVE
    // =====================

    this.saveCart(
      updatedItems
    );

    console.log(
      'Cart updated:',
      updatedItems
    );

  }

  // =========================
  // INCREASE QUANTITY
  // =========================

  increaseQuantity(
    productId: number
  ): void {

    const currentItems =
      this.cartItemsSubject.value;

    const item =
      currentItems.find(
        item =>
          item.product.id === productId
      );

    if (!item) {

      return;

    }

    item.quantity++;

    const updatedItems = [
      ...currentItems
    ];

    this.cartItemsSubject.next(
      updatedItems
    );

    this.saveCart(
      updatedItems
    );

  }

  // =========================
  // DECREASE QUANTITY
  // =========================

  decreaseQuantity(
    productId: number
  ): void {

    const currentItems =
      this.cartItemsSubject.value;

    const item =
      currentItems.find(
        item =>
          item.product.id === productId
      );

    if (!item) {

      return;

    }

    // =====================
    // KURANGI
    // =====================

    if (item.quantity > 1) {

      item.quantity--;

    }

    // =====================
    // HAPUS
    // =====================

    else {

      this.removeFromCart(
        productId
      );

      return;

    }

    const updatedItems = [
      ...currentItems
    ];

    this.cartItemsSubject.next(
      updatedItems
    );

    this.saveCart(
      updatedItems
    );

  }

  // =========================
  // REMOVE FROM CART
  // =========================

  removeFromCart(
    productId: number
  ): void {

    const updatedItems =
      this.cartItemsSubject.value.filter(
        item =>
          item.product.id !== productId
      );

    this.cartItemsSubject.next(
      updatedItems
    );

    this.saveCart(
      updatedItems
    );

  }

  // =========================
  // CLEAR CART
  // =========================

  clearCart(): void {

    // Kosongkan state
    this.cartItemsSubject.next([]);

    // Hapus localStorage
    localStorage.removeItem(
      this.CART_KEY
    );

  }

  // =========================
  // CART COUNT
  // =========================

  getCartCount(): number {

    return this.cartItemsSubject.value.reduce(

      (total, item) =>
        total + item.quantity,

      0

    );

  }

  // =========================
  // TOTAL PRICE
  // =========================

  getTotalPrice(): number {

    return this.cartItemsSubject.value.reduce(

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
