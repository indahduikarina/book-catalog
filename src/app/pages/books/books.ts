import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

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
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {

    // =========================
    // BACA QUERY PARAMS
    // =========================

    this.route.queryParamMap.subscribe(params => {

      this.searchText =
        params.get('search') ?? '';

      this.selectedCategory =
        params.get('category') ?? 'all';

      const page =
        Number(params.get('page'));

      this.currentPage =
        page > 0 ? page : 1;

    });


    // =========================
    // LOAD BOOKS
    // =========================

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


        // =====================
        // AMBIL KATEGORI UNIK
        // =====================

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
  // FILTERED BOOKS
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


  // =========================
  // TOTAL PAGES
  // =========================

  get totalPages(): number {

    return Math.ceil(
      this.filteredBooks.length /
      this.itemsPerPage
    );

  }


  // =========================
  // PAGE NUMBERS
  // =========================

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
  // UPDATE QUERY PARAMS
  // =========================

  updateQueryParams(): void {

    this.router.navigate(
      [],

      {
        relativeTo: this.route,

        queryParams: {

          // SEARCH
          search:
            this.searchText.trim()
              ? this.searchText.trim()
              : null,


          // CATEGORY
          category:
            this.selectedCategory !== 'all'
              ? this.selectedCategory
              : null,


          // PAGE
          page:
            this.currentPage > 1
              ? this.currentPage
              : null

        },

        // Tidak membuat history baru
        // setiap kali mengetik
        replaceUrl: true
      }
    );

  }


  // =========================
  // SEARCH CHANGE
  // =========================

  onSearchChange(): void {

    // Kembali ke halaman pertama
    // ketika search berubah

    this.currentPage = 1;


    this.updateQueryParams();

  }


  // =========================
  // CATEGORY CHANGE
  // =========================

  onCategoryChange(): void {

    // Kembali ke halaman pertama
    // ketika kategori berubah

    this.currentPage = 1;


    this.updateQueryParams();

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


    this.updateQueryParams();


    // Scroll ke atas

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

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
