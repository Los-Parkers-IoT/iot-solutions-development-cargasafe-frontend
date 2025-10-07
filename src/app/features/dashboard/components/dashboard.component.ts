import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';
import { Trip, Alert, IncidentsByMonthData, AlertType } from '../models/trip.model';
import { DashboardService } from '../services/dashboard.service';
import { IncidentsChartComponent } from './incidents-chart/incidents-chart.component';

// Interfaz extendida para el tooltip con información de incidencias
interface TripWithIncidents extends Trip {
  incidentCount: number;
  temperatureIncidents?: number;
  movementIncidents?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, IncidentsChartComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard__header">
        <h1 class="dashboard__title">Dashboard - Monitoreo de Cargas</h1>
        <p class="dashboard__subtitle">
          Visualización y análisis de viajes, incidencias y alertas del sistema CargaSafe
        </p>
      </div>

      <div class="dashboard__content">
        <!-- Loading Indicator -->
        <div *ngIf="loading" style="text-align: center; padding: 20px; background: #f0f0f0; margin: 10px; border-radius: 8px;">
          <h3>🔄 Cargando datos...</h3>
          <p>Por favor espere mientras se cargan los datos del dashboard</p>
        </div>

        <!-- Resumen de Estadísticas -->
        <div class="dashboard__stats" *ngIf="!loading">
          <div class="stat-card">
            <h3>Total de Viajes</h3>
            <span class="stat-number">{{ trips.length }}</span>
          </div>
          <div class="stat-card">
            <h3>Viajes Activos</h3>
            <span class="stat-number">{{ activeTrips }}</span>
          </div>
          <div class="stat-card">
            <h3>Alertas Totales</h3>
            <span class="stat-number">{{ totalAlerts }}</span>
          </div>
          <div class="stat-card">
            <h3>Alertas Pendientes</h3>
            <span class="stat-number">{{ pendingAlerts }}</span>
          </div>
        </div>
              
        <!-- Vista previa de datos -->
        <div class="dashboard__section">
          <div class="data-preview">
            <div *ngIf="loading" class="loading">Cargando datos...</div>
            <div *ngIf="!loading" class="preview-content">
                <h3>Gráfico de Incidencias por Mes</h3>
                <app-incidents-chart
                [data]="incidentsData"
                [loading]="loading">
              </app-incidents-chart>
              <h3>Últimos Viajes</h3>
              <div class="trip-cards">
                <div *ngFor="let trip of trips.slice(0, 3)" 
                     class="trip-card"
                     (click)="navigateToTripDetail(trip.id)">
                  <div class="trip-header">
                    <strong>{{ trip.vehiclePlate }}</strong>
                    <span class="status" [ngClass]="getStatusClass(trip.status)">
                      {{ getStatusText(trip.status) }}
                    </span>
                  </div>
                  <div class="trip-details">
                    <p><strong>Conductor:</strong> {{ trip.driverName }}</p>
                    <p><strong>Ruta:</strong> {{ trip.origin }} → {{ trip.destination }}</p>
                    <p><strong>Carga:</strong> {{ trip.cargoType }}</p>
                    <p><strong>Distancia:</strong> {{ trip.distance }} km</p>
                  </div>
                  <button class="view-details-btn">Ver Detalles</button>
                </div>
              </div>
              
              
              
              <!-- Componente personalizado de gráfico de incidencias -->
              
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  trips: Trip[] = [];
  alerts: Alert[] = [];
  incidentsData: IncidentsByMonthData[] = [];
  loading = true;

  // ngx-charts data
  chartData: any[] = [];
  
  // Chart configuration
  view: [number, number] = [800, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  showYAxisLabel = true;
  yAxisLabel = 'Número de Incidencias';
  
  // Color scheme
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4']
  };

  // Custom tooltip properties
  showCustomTooltip = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: IncidentsByMonthData | null = null;
  tooltipTrips: TripWithIncidents[] = [];

  get activeTrips(): number {
    return this.trips.filter(trip => trip.status === 'IN_PROGRESS' || trip.status === 'COMPLETED').length;
  }

  get totalAlerts(): number {
    return this.alerts.length;
  }

  get pendingAlerts(): number {
    return this.alerts.filter(alert => !alert.resolved).length;
  }

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ngx-charts event handlers
  onSelect(data: any): void {
    console.log('📊 Item clicked:', JSON.parse(JSON.stringify(data)));
    
    // Usar el evento click para mostrar el tooltip también
    if (data && data.name) {
      const monthData = this.incidentsData.find(item => item.month === data.name);
      
      if (monthData) {
        this.tooltipTrips = this.getTripsForMonth(monthData);
        this.tooltipData = monthData;
        
        // Posicionar el tooltip
        this.tooltipX = 300;
        this.tooltipY = 200;
        this.showCustomTooltip = true;
        
        console.log('📊 Tooltip activated via click:', {
          month: monthData.month,
          trips: this.tooltipTrips.length
        });
      }
    }
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  // Custom tooltip event handlers (solo para barras específicas)
  onBarHover(event: any): void {
    console.log('🎯 Bar hover (activate):', event);
    
    if (event && event.name) {
      // Encontrar los datos del mes seleccionado
      const monthData = this.incidentsData.find(item => item.month === event.name);
      
      if (monthData) {
        // Filtrar viajes que tuvieron incidencias en este mes
        this.tooltipTrips = this.getTripsForMonth(monthData);
        this.tooltipData = monthData;
        
        // Activar el tooltip (la posición se actualizará con mousemove)
        this.showCustomTooltip = true;
        
        console.log('📊 Tooltip activado para:', {
          month: monthData.month,
          trips: this.tooltipTrips.length,
          tooltipVisible: this.showCustomTooltip
        });
      }
    }
  }



  // Método de prueba para verificar que el tooltip funciona
  testTooltip(): void {
    console.log('🧪 Testing tooltip...');
    
    if (this.incidentsData.length > 0) {
      const testMonth = this.incidentsData[0]; // Usar el primer mes como prueba
      this.tooltipData = testMonth;
      this.tooltipTrips = this.getTripsForMonth(testMonth);
      
      // Posicionar cerca del centro de la pantalla
      this.tooltipX = window.innerWidth / 2 - 200; // Centrado horizontalmente
      this.tooltipY = window.innerHeight / 2 - 125; // Centrado verticalmente
      this.adjustTooltipPosition();
      this.showCustomTooltip = true;
      
      console.log('✅ Tooltip test activated:', {
        month: testMonth.month,
        tripsCount: this.tooltipTrips.length,
        visible: this.showCustomTooltip,
        position: { x: this.tooltipX, y: this.tooltipY }
      });
      
      // Auto-ocultar después de 5 segundos
      setTimeout(() => {
        this.showCustomTooltip = false;
        console.log('⏰ Tooltip auto-hidden after 5 seconds');
      }, 5000);
    } else {
      console.warn('⚠️ No incidents data available for testing');
    }
  }



  onBarLeave(event: any): void {
    console.log('👋 Bar leave (deactivate):', event);
    this.showCustomTooltip = false;
    this.tooltipData = null;
    this.tooltipTrips = [];
  }

  // Método para actualizar la posición del mouse en tiempo real
  updateMousePosition(event: MouseEvent): void {
    if (this.showCustomTooltip) {
      // Actualizar posición del tooltip en tiempo real mientras está visible
      this.tooltipX = event.clientX + 15; // 15px offset del cursor
      this.tooltipY = event.clientY - 10; // 10px arriba del cursor
      
      // Asegurar que no se salga de la pantalla
      this.adjustTooltipPosition();
    }
  }

  private adjustTooltipPosition(): void {
    const tooltipWidth = 400;
    const tooltipHeight = 250;
    
    // Ajustar horizontalmente
    if (this.tooltipX + tooltipWidth > window.innerWidth) {
      this.tooltipX = window.innerWidth - tooltipWidth - 10;
    }
    if (this.tooltipX < 10) {
      this.tooltipX = 10;
    }
    
    // Ajustar verticalmente
    if (this.tooltipY + tooltipHeight > window.innerHeight) {
      this.tooltipY = window.innerHeight - tooltipHeight - 10;
    }
    if (this.tooltipY < 10) {
      this.tooltipY = 10;
    }
  }

  // Método para obtener viajes que tuvieron incidencias en un mes específico
  private getTripsForMonth(monthData: IncidentsByMonthData): TripWithIncidents[] {
    // Simulamos viajes que tuvieron incidencias en este mes
    const tripsWithIncidents = this.trips.map(trip => {
      // Simulamos el número de incidencias basado en los datos del mes
      const tempIncidents = Math.floor((monthData.temperatureIncidents / this.trips.length) + Math.random() * 2);
      const movIncidents = Math.floor((monthData.movementIncidents / this.trips.length) + Math.random() * 2);
      const totalIncidents = tempIncidents + movIncidents;
      
      return {
        ...trip,
        incidentCount: totalIncidents,
        temperatureIncidents: tempIncidents,
        movementIncidents: movIncidents
      };
    })
    .filter(trip => trip.incidentCount > 0) // Solo viajes con incidencias
    .sort((a, b) => b.incidentCount - a.incidentCount) // Ordenar por más incidencias primero
    .slice(0, 4); // Limitar a 4 viajes para no saturar el tooltip
    
    console.log('🚛 Trips for month:', monthData.month, tripsWithIncidents);
    return tripsWithIncidents;
  }

  // Métodos auxiliares para el tooltip
  getStatusColor(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return '#f59e0b'; // Amarillo para en progreso
      case 'COMPLETED':
        return '#10b981'; // Verde para completado
      case 'DELAYED':
        return '#ef4444'; // Rojo para retrasado
      case 'CANCELLED':
        return '#6b7280'; // Gris para cancelado
      default:
        return '#6b7280';
    }
  }



  navigateToTripDetail(tripId: string): void {
    this.router.navigate(['/trips', tripId]);
    console.log('🚗 Navigating to trip detail:', tripId);
  }

  private loadDashboardData(): void {
    this.loading = true;
    console.log('🚀 Loading dashboard data...');

    forkJoin({
      trips: this.dashboardService.getTrips(),
      alerts: this.dashboardService.getAlerts(),
      incidentsData: this.dashboardService.getIncidentsByMonth()
    }).subscribe({
      next: (data) => {
        console.log('✅ Data loaded successfully:', data);
        
        this.trips = [...(data.trips || [])];
        this.alerts = [...(data.alerts || [])];
        this.incidentsData = [...(data.incidentsData || [])];
        
        console.log('📊 Trips:', this.trips.length, this.trips);
        console.log('🚨 Alerts:', this.alerts.length, this.alerts);
        console.log('📈 Incidents by month:', this.incidentsData.length, this.incidentsData);
        
        // Preparar datos para ngx-charts
        this.prepareChartData();
        
        this.loading = false;
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'DELAYED':
        return 'status-delayed';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'DELAYED':
        return 'Retrasado';
      default:
        return status;
    }
  }

  // Chart data preparation for ngx-charts
  private prepareChartData(): void {
    console.log('📊 Preparing chart data for ngx-charts...');
    
    this.chartData = this.incidentsData.map(monthData => ({
      name: monthData.month,
      series: [
        {
          name: 'Temperatura',
          value: monthData.temperatureIncidents
        },
        {
          name: 'Movimiento', 
          value: monthData.movementIncidents
        }
      ]
    }));
    
    console.log('✅ Chart data prepared:', this.chartData);
  }

  getAlertTypeText(type: AlertType): string {
    switch (type) {
      case AlertType.TEMPERATURE:
        return 'Temperatura';
      case AlertType.MOVEMENT:
        return 'Movimiento';
      default:
        return type;
    }
  }
}