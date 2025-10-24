import {Component, signal} from '@angular/core';
import {RouterOutlet, RouterModule, Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root-layout',
  imports: [RouterOutlet, RouterModule, MatIconModule, NgIf],
  templateUrl: './root-layout.html',
  styleUrls: ['./root-layout.css'],
})
export class RootLayout {
  sidebarOpen = signal(false);

  constructor(private router: Router) {}

  toggleSidebar(state?: boolean): void {
    this.sidebarOpen.set(state !== undefined ? state : !this.sidebarOpen());
  }

  onLogout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    this.router.navigate(['/login']);
  }
}
