import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BookService } from '../../services/book';
import { CartService } from '../../services/cart';
import { Book } from '../../models/book';


@Component({
  selector: 'app-books',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './books.html',

  styleUrl: './books.css'
})


export class Books implements OnInit {

  // =========================
  // DATA
  // =========================

  books: Book[] = [];

  categories: string[] = [];


  // =========================
  // SEARCH & CATEGORY
  // =========================

  searchText: string = '';

  selectedCategory: string = 'all';


  // =========================
  // PAGINATION
  // =========================

  currentPage: number = 1;

  itemsPerPage: number = 8;


  // =========================
  // LOADING & ERROR
  // =========================

  isLoading: boolean = true;

  hasError: boolean = false;


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}


  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    this.loadBooks();

  }


  // =========================
  // LOAD BOOKS
  // =========================

  loadBooks(): void {

    this.isLoading = true;

    this.hasError = false;


    this.bookService.getBooks().subscribe({

      // =====================
      // SUCCESS
      // =====================

      next: (data) => {

        this.books = data;


        // Ambil kategori unik
        this.categories = [
          ...new Set(
            this.books.map(
              book => book.category
            )
          )
        ];


        this.isLoading = false;

        this.hasError = false;


        console.log(
          'Data buku:',
          this.books
        );

      },


      // =====================
      // ERROR
      // =====================

      error: (error) => {

        console.error(
          'Gagal mengambil data buku:',
          error
        );


        this.books = [];

        this.categories = [];


        this.isLoading = false;

        this.hasError = true;

      }

    });

  }


  // =========================
  // FILTER
  // =========================

  get filteredBooks(): Book[] {

    const keyword =
      this.searchText
        .toLowerCase()
        .trim();


    return this.books.filter(book => {

      const matchSearch =
        !keyword ||
        book.title
          .toLowerCase()
          .includes(keyword);


      const matchCategory =
        this.selectedCategory === 'all' ||
        book.category === this.selectedCategory;


      return matchSearch && matchCategory;

    });

  }


  // =========================
  // PAGINATION
  // =========================

  get paginatedBooks(): Book[] {

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;


    const endIndex =
      startIndex +
      this.itemsPerPage;


    return this.filteredBooks.slice(
      startIndex,
      endIndex
    );

  }


  get totalPages(): number {

    return Math.ceil(
      this.filteredBooks.length /
      this.itemsPerPage
    );

  }


  get pageNumbers(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },

      (_, index) =>
        index + 1
    );

  }


  // =========================
  // CHANGE PAGE
  // =========================

  changePage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }


    this.currentPage = page;


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }


  // =========================
  // SEARCH CHANGE
  // =========================

  onSearchChange(): void {

    this.currentPage = 1;

  }


  // =========================
  // CATEGORY CHANGE
  // =========================

  onCategoryChange(): void {

    this.currentPage = 1;

  }


  // =========================
  // ADD TO CART
  // =========================

  addToCart(book: Book): void {

    this.cartService.addToCart(book);


    alert(
      `${book.title} berhasil ditambahkan ke cart!`
    );

  }

}
