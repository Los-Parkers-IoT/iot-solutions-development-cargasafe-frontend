import { Component, OnDestroy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root-layout',
  imports: [RouterModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './root-layout.html',
  styleUrls: ['./root-layout.css'],
})
export class RootLayout implements OnDestroy {
  // Use Angular signals for reactivity and simpler template binding
  sidebarOpen = signal(false);
  private routerSub?: Subscription;

  constructor(private router: Router) {
    // Close sidebar on route change
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidebarOpen.set(false);
      }
    });
  }

  toggleSidebar(open?: boolean) {
    if (typeof open === 'boolean') {
      this.sidebarOpen.set(open);
    } else {
      this.sidebarOpen.update((v) => !v);
    }
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
