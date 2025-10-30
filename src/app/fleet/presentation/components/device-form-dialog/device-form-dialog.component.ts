import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Device } from '../../../domain/model/device.model';
import {DeviceCreateAndEditComponent} from '../device-create-and-edit/device-create-and-edit.component';

export type DeviceFormDialogData = {
  editMode: boolean;
  data: Device;
};

@Component({
  selector: 'app-device-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DeviceCreateAndEditComponent],
  template: `
    <app-device-create-and-edit
      [editMode]="data.editMode"
      [data]="data.data"
      (cancelRequested)="onCancel()"
      (addRequested)="onAdd($event)"
      (updateRequested)="onUpdate($event)">
    </app-device-create-and-edit>
  `
})
export class DeviceFormDialogComponent {
  constructor(
    private ref: MatDialogRef<DeviceFormDialogComponent, { action: 'add'|'update'|'cancel'; payload?: Device }>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceFormDialogData
  ) {}

  onCancel() { this.ref.close({ action: 'cancel' }); }
  onAdd(payload: Device) { this.ref.close({ action: 'add', payload }); }
  onUpdate(payload: Device) { this.ref.close({ action: 'update', payload }); }
}
