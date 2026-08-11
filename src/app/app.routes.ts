import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Books } from './pages/books/books';
import { BookDetail } from './pages/book-detail/book-detail';
import { Cart } from './pages/cart/cart';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [

  // HOME
  {
    path: '',
    component: Home
  },

  // BOOKS / PRODUCTS
  {
    path: 'books',
    component: Books
  },

  // BOOK DETAIL
  {
    path: 'books/:id',
    component: BookDetail
  },

  // CART
  {
    path: 'cart',
    component: Cart
  },

  // NOT FOUND
  {
    path: '**',
    component: NotFound
  }

];
