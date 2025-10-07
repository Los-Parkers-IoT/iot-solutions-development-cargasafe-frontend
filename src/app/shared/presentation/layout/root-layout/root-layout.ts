import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './root-layout.html',
  styleUrl: './root-layout.css',
})
export class RootLayout {}
