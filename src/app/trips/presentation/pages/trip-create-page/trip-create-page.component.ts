import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  effect,
} from '@angular/core';
import {} from '@angular/google-maps';
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
import { Device } from '../../../../fleet/domain/model/device.model';
import { FleetFacade } from '../../../../fleet/application/services/fleet.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddressInputDirective } from '../../../../shared/presentation/directives/address-input.directive';

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
    MatIconModule,
    AddressInputDirective,
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

    enableTemperature: [false, []],
    minTemperature: [null as null | number],
    maxTemperature: [null as null | number],

    enableHumidity: [false, []],
    minHumidity: [null as null | number],
    maxHumidity: [null as null | number],

    enableVibration: [false, []],
    maxVibration: [null as null | number],
    latitude: [null as null | number, [Validators.required]],
    longitude: [null as null | number, [Validators.required]],
    notes: ['Take it easy!!!', []],
  });

  // -------------------------------------------------------
  // INIT
  // -------------------------------------------------------

  ngOnInit(): void {
    this.originPointsStore.loadOriginPoints();
    this.fleetStore.loadDevices();
    this.fleetStore.loadVehicles();
  }

  readonly enableTemperature = toSignal(this.orderForm.controls.enableTemperature.valueChanges, {
    initialValue: this.orderForm.controls.enableTemperature.value,
  });

  readonly enableHumidity = toSignal(this.orderForm.controls.enableHumidity.valueChanges, {
    initialValue: this.orderForm.controls.enableHumidity.value,
  });

  readonly enableVibration = toSignal(this.orderForm.controls.enableVibration.valueChanges, {
    initialValue: this.orderForm.controls.enableVibration.value,
  });

  readonly tempToggleEffect = effect(() => {
    const enabled = this.enableTemperature();
    const min = this.orderForm.controls.minTemperature;
    const max = this.orderForm.controls.maxTemperature;
    enabled ? (min.enable(), max.enable()) : (min.disable(), max.disable());
  });

  readonly humidityToggleEffect = effect(() => {
    const enabled = this.enableHumidity();
    const field = this.orderForm.controls.minHumidity;
    enabled ? field.enable() : field.disable();
  });

  readonly vibrationToggleEffect = effect(() => {
    const enabled = this.enableVibration();
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

  resetOrderForm() {
    this.orderForm.reset({
      address: '',
      enableTemperature: false,
      minTemperature: null,
      maxTemperature: null,

      enableHumidity: false,
      minHumidity: null,
      maxHumidity: null,

      enableVibration: false,
      maxVibration: null,

      latitude: null,
      longitude: null,

      notes: 'Take it easy!!!',
    });
  }
  openAddOrder() {
    this.editingIndex.set(null);
    this.orderForm.reset();
    this.isOrderModalOpen.set(true);
    this.resetOrderForm();
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
      console.log('Form invalid', this.orderForm.value);
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
        lat: value.latitude!,
        lng: value.longitude!,
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

  onChangeAddress(results: google.maps.places.PlaceResult) {
    if (results.geometry?.location) {
      const lat = results.geometry.location.lat();
      const lng = results.geometry.location.lng();
      this.orderForm.patchValue({ address: results.formatted_address || '' });
      this.orderForm.patchValue({ latitude: lat, longitude: lng });
    }
  }

  // -------------------------------------------------------
  // TOAST
  // -------------------------------------------------------

  private showToastMsg(msg: string) {
    this.toastMessage.set(msg);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 1800);
  }

  saveTrip() {
    console.log('Trip saved', this.tripForm.value, this.deliveryOrders());
  }
}
