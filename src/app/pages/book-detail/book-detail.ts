import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {

  book: Book | undefined;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.bookService.getBooks().subscribe({
      next: (books) => {

        this.book = books.find(
          book => book.id === id
        );

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Gagal mengambil detail buku:',
          error
        );

        this.loading = false;

      }
    });

  }
}
