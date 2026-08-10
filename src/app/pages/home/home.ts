import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookService } from '../../services/book';
import { Book } from '../../models/book';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  books: Book[] = [];


  constructor(
    private bookService: BookService
  ) {}


  ngOnInit(): void {

    this.bookService.getBooks().subscribe({

      next: (data) => {

        this.books = data;

        console.log(
          'Data Home:',
          this.books
        );

      },

      error: (error) => {

        console.error(
          'Gagal mengambil data:',
          error
        );

      }

    });

  }

}
