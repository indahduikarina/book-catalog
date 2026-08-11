import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BookService } from '../../services/book';
import { CartService } from '../../services/cart';
import { Book } from '../../models/book';

@Component({
  selector: 'app-book-detail',
  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {

  // =========================
  // PRODUCT DATA
  // =========================

  book: Book | undefined;


  // =========================
  // LOADING & ERROR
  // =========================

  isLoading: boolean = true;

  hasError: boolean = false;


  // =========================
  // ADD TO CART FEEDBACK
  // =========================

  addedToCart: boolean = false;


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService
  ) {}


  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    this.loadProduct();

  }


  // =========================
  // LOAD PRODUCT
  // =========================

  loadProduct(): void {

    this.isLoading = true;

    this.hasError = false;


    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    this.bookService.getBooks().subscribe({

      next: (products) => {

        this.book = products.find(
          product => product.id === id
        );


        if (!this.book) {

          this.hasError = true;

        }


        this.isLoading = false;

      },


      error: (error) => {

        console.error(
          'Gagal mengambil detail produk:',
          error
        );


        this.book = undefined;

        this.isLoading = false;

        this.hasError = true;

      }

    });

  }


  // =========================
  // ADD TO CART
  // =========================

  addToCart(): void {

    if (!this.book) {

      return;

    }


    this.cartService.addToCart(
      this.book
    );


    this.addedToCart = true;


    // Hilangkan feedback
    // setelah beberapa saat

    setTimeout(() => {

      this.addedToCart = false;

    }, 2000);

  }

}
