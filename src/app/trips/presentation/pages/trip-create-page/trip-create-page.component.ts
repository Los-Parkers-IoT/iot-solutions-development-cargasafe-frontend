import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-trip-create-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './trip-create-page.component.html',
  styleUrls: ['./trip-create-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripCreatePageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      driver: ['Juan Pablo'],
      codriver: ['Search by user'],
      vehicle: ['BMD-123'],
      device: ['KJF82H'],
      departureAt: ['2025-08-10T08:00'],
      deliveryOrders: [[]],
    });
  }

  addDeliveryOrder() {
    const list = this.form.value.deliveryOrders ?? [];
    this.form.patchValue({
      deliveryOrders: [
        ...list,
        {
          address: `Av ${Math.floor(Math.random() * 100)} Example`,
          lat: '-12.05',
          lng: '-77.03',
          minTemp: 22,
          maxTemp: 35,
        },
      ],
    });
  }

  save() {
    console.log('Mock save', this.form.value);
  }
}
