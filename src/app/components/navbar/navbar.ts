import {
  Component,
  OnInit
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  CartService
} from '../../services/cart';

@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  // =========================
  // CART COUNT
  // =========================

  cartCount: number = 0;

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

    this.cartService.cartItems$.subscribe(
      items => {

        this.cartCount = items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        );

      }
    );

  }

}
