import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FleetFacade } from '../../../application/services/fleet.facade';
import { Vehicle } from '../../../domain/model/vehicle.model';

@Component({
  selector: 'app-assign-vehicle-dialog',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './assign-vehicle-dialog.html',
  styleUrl: './assign-vehicle-dialog.css',
  standalone: true,
})
export class AssignVehicleDialogComponent {
  private facade = inject(FleetFacade);
  private ref = inject(MatDialogRef<AssignVehicleDialogComponent, number>);
  vehicles: Vehicle[] = [];
  selectedId?: number;

  constructor(){
    this.facade.vehicles$.subscribe(v => this.vehicles = v);
    this.facade.loadVehicles();
  }
  close(){ this.ref.close(); }
  ok(){ this.ref.close(this.selectedId); }
}
