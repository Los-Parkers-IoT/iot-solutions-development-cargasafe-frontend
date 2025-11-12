import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface DeliveryOrder{
  address: string;
  enableTemperature: boolean;
  minTemperature?: number | null;
  maxTemperature?: number | null;

  enableHumidity: boolean;
  minHumidity?: number | null;

  enableVibration: boolean;
  maxVibration?: number | null;

  notes?: string;

  lat?: number;
  lng?: number;
}

interface TripForm {
  driver: string;
  codriver: string;
  plate: string;
  device: string;
  departureAt: string;
  originPoint: string;
}

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

export class TripCreatePageComponent implements OnInit {
  tripForm!: FormGroup;

  deliveryOrders: DeliveryOrder[] = [];

  isOrderModalOpen = false;
  orderForm!: FormGroup;
  isSaving = false;
  editingIndex: number | null = null;

  toastMessage = '';
  showToast = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tripForm = this.fb.group({
      driver: ['Juan Pablo'],
      codriver: [''],
      plate: ['BMD-123'],
      device: ['Device-001'],
      departureAt: ['08/10/2025 08:00:00'],
      originPoint: ['Warehouse 1'],
    });

    this.orderForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(3)]],

      enableTemperature: [true],
      minTemperature: [24],
      maxTemperature: [8,],

      enableHumidity: [false],
      minHumidity: [{ value: null, disabled: true }],

      enableVibration: [true],
      maxVibration: [1.5],

      notes: ['Take it easy!!!'],
    });

    this.orderForm.get('enableTemperature')?.valueChanges.subscribe((on) => {
      const min = this.orderForm.get('minTemperature');
      const max = this.orderForm.get('maxTemperature');
      on ? (min?.enable(), max?.enable()) : (min?.disable(), max?.disable());
    });

    this.orderForm.get('enableHumidity')?.valueChanges.subscribe((on) => {
      const minH = this.orderForm.get('minHumidity');
      on ? minH?.enable() : minH?.disable();
    });

    this.orderForm.get('enableVibration')?.valueChanges.subscribe((on) => {
      const maxV = this.orderForm.get('maxVibration');
      on ? maxV?.enable() : maxV?.disable();
    });
  }

  openAddOrder(): void {
    this.editingIndex = null;
    this.orderForm.reset({
      address: '',
      enableTemperature: true,
      minTemperature: null,
      maxTemperature: null,

      enableHumidity: false,
      minHumidity: null,

      enableVibration: false,
      maxVibration: null,

      notes: '',
    });
    this.isOrderModalOpen = true;
  }

  openEditOrder(index: number): void {
    const o = this.deliveryOrders[index];
    this.editingIndex = index;
    this.orderForm.reset({
      address: o.address,
      enableTemperature: o.enableTemperature,
      minTemperature: o.minTemperature ?? null,
      maxTemperature: o.maxTemperature ?? null,

      enableHumidity: o.enableHumidity,
      minHumidity: o.minHumidity ?? null,

      enableVibration: o.enableVibration,
      maxVibration: o.maxVibration ?? null,

      notes: o.notes ?? '',
    });
    this.isOrderModalOpen = true;
  }

  closeOrderModal(): void {
    if (this.isSaving) return;
    this.isOrderModalOpen = false;
    this.editingIndex = null;
  }

  saveOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.orderForm.disable();

    setTimeout(() => {
      const formValue = this.orderForm.getRawValue();

      const newOrder: DeliveryOrder = {
        address: formValue.address,
        enableTemperature: formValue.enableTemperature,
        minTemperature: formValue.minTemperature,
        maxTemperature: formValue.maxTemperature,

        enableHumidity: formValue.enableHumidity,
        minHumidity: formValue.minHumidity,

        enableVibration: formValue.enableVibration,
        maxVibration: formValue.maxVibration,

        notes: formValue.notes,
        lat: -12.08 + Math.random() * 0.1,
        lng: -77.05 + Math.random() * 0.1,
      };

      if (this.editingIndex === null) {
        this.deliveryOrders.push(newOrder);
      } else {
        this.deliveryOrders[this.editingIndex] = newOrder;
      }

      this.isSaving = false;
      this.isOrderModalOpen = false;
      this.orderForm.enable();
      this.editingIndex = null;

      this.showToastMsg('Order saved');
    }, 1200);
  }

  deleteOrder(i: number): void {
    this.deliveryOrders.splice(i, 1);
    this.showToastMsg('Order removed');
  }

  private showToastMsg(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 1800);
  }
}
