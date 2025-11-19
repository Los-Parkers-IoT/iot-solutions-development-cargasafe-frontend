/*import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/vehicles`;

  getAll(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(this.baseUrl); }
  getById(id: number) { return this.http.get<Vehicle>(`${this.baseUrl}/${id}`); }
  create(payload: Vehicle): Observable<Vehicle> { return this.http.post<Vehicle>(this.baseUrl, payload); }
  update(payload: Vehicle): Observable<Vehicle> { return this.http.put<Vehicle>(`${this.baseUrl}/${payload.id}`, payload); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}*/
