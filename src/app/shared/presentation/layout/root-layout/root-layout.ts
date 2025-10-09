import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root-layout',
  imports: [RouterModule, MatIconModule],
  templateUrl: './root-layout.html',
  styleUrls: ['./root-layout.css'],
})
export class RootLayout {}
