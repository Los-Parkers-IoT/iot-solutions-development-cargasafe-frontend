import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OriginPointsStore } from '../../../application/origin-points.store';
import { MatSelectModule } from '@angular/material/select';
import { OriginPoint } from '../../../domain/model/origin-point.entity';
import { createAsyncState } from '../../../../shared/helpers/lazy-resource';
import { Device } from '../../../../fleet/domain/model/device.model';
import { FleetFacade } from '../../../../fleet/application/services/fleet.facade';
import { toSignal } from '@angular/core/rxjs-interop';

interface DeliveryOrder {
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
    MatProgressSpinnerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
  ],
  templateUrl: './trip-create-page.component.html',
  styleUrls: ['./trip-create-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripCreatePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private originPointsStore = inject(OriginPointsStore);
  private fleetStore = inject(FleetFacade);
  // -------------------------------------------------------
  // SIGNALS
  // -------------------------------------------------------

  /** List of OriginPoint entities from the store */
  originPoints = computed<OriginPoint[]>(() => this.originPointsStore.store.data());
  vehicles = computed(() => this.fleetStore.vehiclesSig());
  devices = computed<Device[]>(() => this.fleetStore.devicesSig());

  /** Delivery orders stored in signal */
  deliveryOrders = signal<DeliveryOrder[]>([]);

  isOrderModalOpen = signal(false);
  isSaving = signal(false);
  editingIndex = signal<number | null>(null);

  toastMessage = signal('');
  showToast = signal(false);

  // -------------------------------------------------------
  // TRIP FORM (STRONGLY TYPED)
  // -------------------------------------------------------

  tripForm = this.fb.nonNullable.group({
    driver: ['Juan Pablo'],
    codriver: [''],
    // Store OriginPoint ENTITY, not a string
    originPoint: [null as OriginPoint | null, Validators.required],
    vehicleId: [null as null | number, Validators.required],
  });
  vehicleIdSig = toSignal(this.tripForm.controls.vehicleId.valueChanges, {
    initialValue: this.tripForm.controls.vehicleId.value,
  });

  device = computed(() => {
    const vehicleId = this.vehicleIdSig();
    if (!vehicleId) return null;

    const vehicle = this.vehicles().find((v) => v.id === vehicleId);
    if (!vehicle) return null;

    return this.devices().find((d) => vehicle.deviceImeis.includes(d.imei)) ?? null;
  });

  // -------------------------------------------------------
  // ORDER FORM (REFACTORED)
  // -------------------------------------------------------

  orderForm = this.fb.group({
    address: ['', [Validators.required, Validators.minLength(3)]],

    enableTemperature: [true],
    minTemperature: [{ value: null as null | number, disabled: false }],
    maxTemperature: [{ value: null as null | number, disabled: false }],

    enableHumidity: [false],
    minHumidity: [{ value: null as null | number, disabled: true }],
    maxHumidity: [{ value: null as null | number, disabled: true }],

    enableVibration: [true],
    maxVibration: [{ value: 1.5, disabled: false }],

    notes: ['Take it easy!!!'],
  });

  // -------------------------------------------------------
  // INIT
  // -------------------------------------------------------

  ngOnInit(): void {
    this.originPointsStore.loadOriginPoints();
    this.fleetStore.loadDevices();
    this.fleetStore.loadVehicles();
  }

  // Runs in injection context
  readonly tempToggleEffect = effect(() => {
    const enabled = this.orderForm.value.enableTemperature;
    const min = this.orderForm.controls.minTemperature;
    const max = this.orderForm.controls.maxTemperature;
    enabled ? (min.enable(), max.enable()) : (min.disable(), max.disable());
  });

  readonly humidityToggleEffect = effect(() => {
    const enabled = this.orderForm.value.enableHumidity;
    const field = this.orderForm.controls.minHumidity;
    enabled ? field.enable() : field.disable();
  });

  readonly vibrationToggleEffect = effect(() => {
    const enabled = this.orderForm.value.enableVibration;
    const field = this.orderForm.controls.maxVibration;
    enabled ? field.enable() : field.disable();
  });

  // Avoid ExpressionChangedAfterItHasBeenCheckedError
  readonly defaultOriginEffect = effect(() => {
    const points = this.originPoints();
    if (points.length === 0) return;

    Promise.resolve().then(() => {
      if (!this.tripForm.value.originPoint) {
        this.tripForm.patchValue({ originPoint: points[0] });
      }
    });
  });

  // -------------------------------------------------------
  // MAT-SELECT: ENTITY COMPARATOR
  // -------------------------------------------------------

  compareOriginPoints = (a: OriginPoint, b: OriginPoint) => a && b && a.id === b.id;

  // -------------------------------------------------------
  // MODAL LOGIC
  // -------------------------------------------------------

  openAddOrder() {
    this.editingIndex.set(null);
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
    this.isOrderModalOpen.set(true);
  }

  openEditOrder(index: number) {
    const o = this.deliveryOrders()[index];
    this.editingIndex.set(index);

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

    this.isOrderModalOpen.set(true);
  }

  closeOrderModal() {
    if (!this.isSaving()) this.isOrderModalOpen.set(false);
    this.editingIndex.set(null);
  }

  // -------------------------------------------------------
  // SAVE ORDER
  // -------------------------------------------------------

  saveOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.orderForm.disable();

    setTimeout(() => {
      const value = this.orderForm.getRawValue();

      const newOrder: DeliveryOrder = {
        address: value.address!,
        enableTemperature: value.enableTemperature!,
        minTemperature: value.minTemperature ?? undefined,
        maxTemperature: value.maxTemperature ?? undefined,
        enableHumidity: value.enableHumidity!,
        minHumidity: value.minHumidity ?? undefined,
        enableVibration: value.enableVibration!,
        maxVibration: value.maxVibration ?? undefined,
        notes: value.notes ?? undefined,
        lat: -12.08 + Math.random() * 0.1,
        lng: -77.05 + Math.random() * 0.1,
      };

      const idx = this.editingIndex();

      if (idx === null) {
        this.deliveryOrders.update((list) => [...list, newOrder]);
      } else {
        this.deliveryOrders.update((list) => {
          const copy = [...list];
          copy[idx] = newOrder;
          return copy;
        });
      }

      this.isSaving.set(false);
      this.orderForm.enable();
      this.editingIndex.set(null);
      this.isOrderModalOpen.set(false);
      this.showToastMsg('Order saved');
    }, 1200);
  }

  deleteOrder(i: number) {
    this.deliveryOrders.update((list) => list.filter((_, x) => x !== i));
    this.showToastMsg('Order removed');
  }

  // -------------------------------------------------------
  // TOAST
  // -------------------------------------------------------

  private showToastMsg(msg: string) {
    this.toastMessage.set(msg);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 1800);
  }
}
