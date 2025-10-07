import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './root-layout.html',
  styleUrls: ['./root-layout.css'],
})
export class RootLayout {}
