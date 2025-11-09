import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../domain/model/vehicle.model';
import { VehicleCreateAndEditComponent } from '../vehicle-create-and-edit/vehicle-create-and-edit';

export type VehicleFormDialogData = {
  editMode: boolean;
  data: Vehicle;
};

@Component({
  selector: 'app-vehicle-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, VehicleCreateAndEditComponent],
  template: `
    <app-vehicle-create-and-edit
      [editMode]="data.editMode"
      [data]="data.data"
      (cancelRequested)="onCancel()"
      (addRequested)="onAdd($event)"
      (updateRequested)="onUpdate($event)">
    </app-vehicle-create-and-edit>
  `,
})
export class VehicleFormDialogComponent {
  constructor(
    private ref: MatDialogRef<VehicleFormDialogComponent, { action: 'add'|'update'|'cancel'; payload?: Vehicle }>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleFormDialogData
  ) {}

  onCancel() { this.ref.close({ action: 'cancel' }); }
  onAdd(payload: Vehicle) { this.ref.close({ action: 'add', payload }); }
  onUpdate(payload: Vehicle) { this.ref.close({ action: 'update', payload }); }
}
