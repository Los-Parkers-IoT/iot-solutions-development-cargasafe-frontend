import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { Trip, IncidentsByMonthData, Alert, AlertType } from '../../../domain/model';
import { DashboardStore } from '../../../application/dto/dashboard.store';
import { IncidentsChartComponent } from '../../components/incidents-chart/incidents-chart.component';
import { PdfExportService } from '../../../application/pdf-export.service';

interface TripWithIncidents extends Trip {
  incidentCount: number;
  temperatureIncidents?: number;
  movementIncidents?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, IncidentsChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private dashboardStore = inject(DashboardStore);
  private router = inject(Router);
  private pdfExportService = inject(PdfExportService);

  trips = this.dashboardStore.tripsState.data;
  alerts = this.dashboardStore.alertsState.data;
  incidentsData = this.dashboardStore.incidentsState.data;
  loading = this.dashboardStore.tripsState.loading;
  exporting = signal(false);

  // ngx-charts data
  chartData: any[] = [];
  
  // Chart configuration
  view: [number, number] = [800, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Number of Incidents';
  
  // Color scheme
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4']
  };

  showCustomTooltip = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: IncidentsByMonthData | null = null;
  tooltipTrips: TripWithIncidents[] = [];

  get activeTrips(): number {
    return this.dashboardStore.activeTripsCount();
  }

  get totalAlerts(): number {
    return this.dashboardStore.totalAlertsCount();
  }

  get pendingAlerts(): number {
    return this.dashboardStore.pendingAlertsCount();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ngx-charts event handlers
  onSelect(data: any): void {
    console.log('📊 Item clicked:', JSON.parse(JSON.stringify(data)));
    
    if (data && data.name) {
      const monthData = this.incidentsData().find(item => item.month === data.name);
      
      if (monthData) {
        this.tooltipTrips = this.getTripsForMonth(monthData);
        this.tooltipData = monthData;
        
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

  onBarHover(event: any): void {
    console.log('🎯 Bar hover (activate):', event);
    
    if (event && event.name) {
      const monthData = this.incidentsData().find(item => item.month === event.name);
      
      if (monthData) {
        this.tooltipTrips = this.getTripsForMonth(monthData);
        this.tooltipData = monthData;
        
        this.showCustomTooltip = true;
        
        console.log('📊 Tooltip activado para:', {
          month: monthData.month,
          trips: this.tooltipTrips.length,
          tooltipVisible: this.showCustomTooltip
        });
      }
    }
  }



  testTooltip(): void {
    console.log('🧪 Testing tooltip...');
    
    if (this.incidentsData().length > 0) {
      const testMonth = this.incidentsData()[0];
      this.tooltipData = testMonth;
      this.tooltipTrips = this.getTripsForMonth(testMonth);
      
      this.tooltipX = window.innerWidth / 2 - 200;
      this.tooltipY = window.innerHeight / 2 - 125;
      this.adjustTooltipPosition();
      this.showCustomTooltip = true;
      
      console.log('✅ Tooltip test activated:', {
        month: testMonth.month,
        tripsCount: this.tooltipTrips.length,
        visible: this.showCustomTooltip,
        position: { x: this.tooltipX, y: this.tooltipY }
      });
      
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

  updateMousePosition(event: MouseEvent): void {
    if (this.showCustomTooltip) {
      this.tooltipX = event.clientX + 15;
      this.tooltipY = event.clientY - 10;
      
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

  private getTripsForMonth(monthData: IncidentsByMonthData): TripWithIncidents[] {
    const tripsWithIncidents: TripWithIncidents[] = this.trips().map(trip => {
      const tempIncidents = Math.floor((monthData.temperatureIncidents / this.trips().length) + Math.random() * 2);
      const movIncidents = Math.floor((monthData.movementIncidents / this.trips().length) + Math.random() * 2);
      const totalIncidents = tempIncidents + movIncidents;
      
      return Object.assign(trip, {
        incidentCount: totalIncidents,
        temperatureIncidents: tempIncidents,
        movementIncidents: movIncidents
      }) as TripWithIncidents;
    })
    .filter(trip => trip.incidentCount > 0)
    .sort((a, b) => b.incidentCount - a.incidentCount)
    .slice(0, 4);
    
    console.log('🚛 Trips for month:', monthData.month, tripsWithIncidents);
    return tripsWithIncidents;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return '#f59e0b';
      case 'COMPLETED':
        return '#10b981';
      case 'DELAYED':
        return '#ef4444';
      case 'CANCELLED':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  }



  navigateToTripDetail(tripId: number | null | undefined): void {
    if (tripId == null) {
      console.error('❌ Trip ID is null or undefined');
      return;
    }
    this.router.navigate(['/dashboard/trip', tripId.toString()]);
    console.log('🚗 Navigating to trip detail:', tripId);
  }

  private loadDashboardData(): void {
    console.log('🚀 Loading dashboard data...');
    
    this.dashboardStore.loadTrips();
    this.dashboardStore.loadAlerts();
    this.dashboardStore.loadIncidentsByMonth();
    
    setTimeout(() => {
      this.prepareChartData();
    }, 500);
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
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'DELAYED':
        return 'Delayed';
      default:
        return status;
    }
  }

  // Chart data preparation for ngx-charts
  private prepareChartData(): void {
    console.log('📊 Preparing chart data for ngx-charts...');
    
    this.chartData = this.incidentsData().map(monthData => ({
      name: monthData.month,
      series: [
        {
          name: 'Temperature',
          value: monthData.temperatureIncidents
        },
        {
          name: 'Movement', 
          value: monthData.movementIncidents
        }
      ]
    }));
    
    console.log('✅ Chart data prepared:', this.chartData);
  }

  getAlertTypeText(type: AlertType): string {
    switch (type) {
      case AlertType.TEMPERATURE:
        return 'Temperature';
      case AlertType.MOVEMENT:
        return 'Movement';
      default:
        return type;
    }
  }

  async exportToPdf(): Promise<void> {
    this.exporting.set(true);
    
    try {
      await this.pdfExportService.exportDashboardToPdf(
        this.trips(),
        this.alerts(),
        this.incidentsData()
      );
      console.log('✅ PDF exported successfully');
    } catch (error) {
      console.error('❌ Error exporting PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      this.exporting.set(false);
    }
  }
}

