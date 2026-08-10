import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'https://dummyjson.com/products';

  constructor(
    private http: HttpClient
  ) {}

  // Mengambil semua buku
  getBooks(): Observable<Book[]> {

    return this.http
      .get<{ products: Book[] }>(this.apiUrl)
      .pipe(
        map(response => response.products)
      );

  }


  // Mengambil satu buku berdasarkan ID
  getBookById(id: number): Observable<Book> {

    return this.http.get<Book>(
      `${this.apiUrl}/${id}`
    );

  }

}
