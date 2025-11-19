import {Component, Inject, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {FleetFacade} from '../../../application/services/fleet.facade';
import {Device} from '../../../domain/model/device.model';


type DialogResult = { imei: string } | undefined;

@Component({
  selector: 'app-assign-device-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './assign-device-dialog.html',
  styleUrl: './assign-device-dialog.css'
})
export class AssignDeviceDialogComponent implements OnInit {
  private facade = inject(FleetFacade);
  private ref = inject(MatDialogRef<AssignDeviceDialogComponent, DialogResult>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { vehicleId: number }) {}

  devices: Device[] = [];
  selectedImei = '';

  ngOnInit(): void {
    this.facade.devices$.subscribe(list => {
      // solo dispositivos SIN asignación
      this.devices = (list ?? []).filter(d => !d.vehiclePlate);
    });
    this.facade.loadDevices();
  }

  close() { this.ref.close(); }
  assign() {
    if (this.selectedImei) this.ref.close({ imei: this.selectedImei });
  }
}
