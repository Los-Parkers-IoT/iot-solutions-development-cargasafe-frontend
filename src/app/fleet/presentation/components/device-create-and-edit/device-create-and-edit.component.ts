import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {defaultDevice, Device, DeviceType} from '../../../domain/model/device.model';

@Component({
  selector: 'app-device-create-and-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule
  ],
  templateUrl: './device-create-and-edit.component.html',
  styleUrl: './device-create-and-edit.component.css'
})
export class DeviceCreateAndEditComponent {
  @Input() editMode = false;
  @Input() data: Device = { ...defaultDevice };
  @Output() cancelRequested = new EventEmitter<void>();
  @Output() addRequested = new EventEmitter<Device>();
  @Output() updateRequested = new EventEmitter<Device>();

  // PUBLIC so the template can read it
  deviceTypes: DeviceType[] = ['Temp + GPS', 'GPS', 'Env Sensor'];

  submit(): void {
    this.editMode ? this.updateRequested.emit(this.data) : this.addRequested.emit(this.data);
  }
}
