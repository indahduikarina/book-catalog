import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Books } from './pages/books/books';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [

  // =========================
  // HOME
  // =========================

  {
    path: '',
    component: Home
  },


  // =========================
  // BOOKS
  // =========================

  {
    path: 'books',
    component: Books
  },


  // =========================
  // BOOK DETAIL
  // =========================

  {
    path: 'books/:id',
    loadComponent: () =>
      import('./pages/book-detail/book-detail')
        .then(
          m => m.BookDetail
        )
  },


  // =========================
  // 404 NOT FOUND
  // =========================

  {
    path: '**',
    component: NotFound
  }

];
