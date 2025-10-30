import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatChipSelectionChange, MatChipsModule} from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import {defaultVehicle, Vehicle, VehicleStatus, VehicleType} from '../../../domain/model/vehicle.model';


@Component({
  selector: 'app-vehicle-create-and-edit',
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatButtonModule
  ],
  templateUrl: './vehicle-create-and-edit.html',
  styleUrl: './vehicle-create-and-edit.css'
})
export class VehicleCreateAndEditComponent {
  @Input() editMode = false;
  @Input() data: Vehicle = { ...defaultVehicle };
  @Output() cancelRequested = new EventEmitter<void>();
  @Output() addRequested = new EventEmitter<Vehicle>();
  @Output() updateRequested = new EventEmitter<Vehicle>();

  // PUBLIC lists
  vehicleTypes: VehicleType[] = ['Truck', 'Van', 'Trailer'];
  statuses: VehicleStatus[] = ['Available', 'Reserved', 'In Service', 'In Maintenance', 'Out of Service'];
  caps: string[] = ['Reefer', 'Box', 'Flatbed', 'Liftgate'];

  toggleCap(c: string): void {
    const set = new Set(this.data.capabilities || []);
    set.has(c) ? set.delete(c) : set.add(c);
    this.data.capabilities = Array.from(set);
  }

  submit(): void {
    this.editMode ? this.updateRequested.emit(this.data) : this.addRequested.emit(this.data);
  }

  isSelected(cap: string): boolean {
    const list = this.data.capabilities;
    return Array.isArray(list) ? list.includes(cap) : false;
  }

  onChipSelectionChange(cap: string, ev: MatChipSelectionChange) {
    const list = Array.isArray(this.data.capabilities) ? [...this.data.capabilities] : [];
    this.data.capabilities = ev.selected
      ? (list.includes(cap) ? list : [...list, cap])
      : list.filter(x => x !== cap);
  }

}
