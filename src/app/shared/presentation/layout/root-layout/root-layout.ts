import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root-layout',
  imports: [RouterModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './root-layout.html',
  styleUrls: ['./root-layout.css'],
})
export class RootLayout {
  // Use Angular signals for reactivity and simpler template binding
  sidebarOpen = signal(false);

  toggleSidebar(open?: boolean) {
    if (typeof open === 'boolean') {
      this.sidebarOpen.set(open);
    } else {
      this.sidebarOpen.update((v) => !v);
    }
  }
}
