import { Component } from '@angular/core';

@Component({
  selector: 'app-logout-page',
  standalone: true,
  template: ``,
})
export class LogoutPageComponent {

  constructor() {
    // Usamos navegación del navegador, NO del router de Angular,
    // para evitar que Angular destruya RootLayout y llame a ngOnDestroy().
    window.location.href = '/login';
  }
}
