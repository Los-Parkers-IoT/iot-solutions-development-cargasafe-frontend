import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './root-layout.html',
  styleUrl: './root-layout.css',
})
export class RootLayout {}
