import { Component, OnInit, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from '../../../domain/model';
import { DashboardStore } from '../../../application/dto/dashboard.store';

interface SensorData {
  name: string;
  value: number;
  timestamp: string;
  alert?: boolean;
}

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatIconModule],
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {
  trip!: Trip;
  loading = true;

  temperatureData: any[] = [];
  temperatureChartData: any[] = [];
  
  vibrationData: any[] = [];
  vibrationChartData: any[] = [];

  view: [number, number] = [600, 350];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Time';
  yAxisLabelTemp = 'Temperature (°C)';
  yAxisLabelVib = 'Vibration (g)';
  timeline = true;
  autoScale = true;

  temperatureColorScheme: any = {
    domain: ['#3b82f6', '#ef4444', '#f59e0b']
  };

  vibrationColorScheme: any = {
    domain: ['#E7F7DD', '#9263F8']
  };

  tempUpperLimit = 8;
  tempLowerLimit = 2;

  vibrationSafeLimit = 2.0;

  stats = {
    temperature: {
      min: 0,
      max: 0,
      avg: 0
    },
    vibration: {
      min: 0,
      max: 0,
      avg: 0,
      alertCount: 0
    }
  };

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dashboardStore = inject(DashboardStore);
  
  private currentTripId = signal<string | null>(null);

  constructor() {
    // Setup effect in constructor (injection context)
    effect(() => {
      const tripId = this.currentTripId();
      if (!tripId) return;
      
      const trips = this.dashboardStore.tripsState.data();
      const loading = this.dashboardStore.tripsState.loading();
      const error = this.dashboardStore.tripsState.error();
      
      if (error) {
        console.error('❌ Error loading trip:', error);
        this.loading = false;
        this.router.navigate(['/dashboard']);
        return;
      }
      
      if (!loading) {
        const trip = trips.find(t => t.id.toString() === tripId);
        
        if (trip) {
          console.log('✅ Trip loaded successfully:', trip);
          this.trip = trip;
          this.loading = false;
          this.generateMockData();
          this.prepareChartData();
          this.calculateStats();
          console.log('📊 Data generated and charts prepared');
        } else if (trips.length > 0) {
          // Only navigate away if trips have been loaded but trip not found
          console.warn('⚠️ Trip not found with ID:', tripId);
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  ngOnInit() {
    console.log('🔍 TripDetailComponent ngOnInit');
    this.route.params.subscribe(params => {
      const tripId = params['id'];
      console.log('🚗 Trip ID from route:', tripId);
      this.loadTrip(tripId);
    });
  }

  loadTrip(tripId: string) {
    console.log('📡 Loading trip with ID:', tripId);
    this.loading = true;
    this.currentTripId.set(tripId);
    this.dashboardStore.loadTripById(tripId);
  }

  private generateMockData() {
    const startTime = new Date(this.trip.startDate);
    const hours = 12;
    const intervals = 24;

    for (let i = 0; i < intervals; i++) {
      const time = new Date(startTime.getTime() + (i * 30 * 60 * 1000));
      const temp = 2 + Math.random() * 6;
      const isOutOfRange = temp > this.tempUpperLimit || temp < this.tempLowerLimit;

      this.temperatureData.push({
        timestamp: time,
        temperature: parseFloat(temp.toFixed(1)),
        upperLimit: this.tempUpperLimit,
        lowerLimit: this.tempLowerLimit,
        alert: isOutOfRange
      });
    }

    for (let i = 0; i < intervals; i++) {
      const time = new Date(startTime.getTime() + (i * 30 * 60 * 1000));
      const vib = Math.random() * 3.5;
      const isAlert = vib > this.vibrationSafeLimit;

      this.vibrationData.push({
        timestamp: time,
        vibration: parseFloat(vib.toFixed(1)),
        safeZone: this.vibrationSafeLimit,
        alert: isAlert
      });
    }
  }

  private prepareChartData() {
    this.temperatureChartData = [
      {
        name: 'Temperature (°C)',
        series: this.temperatureData.map(d => ({
          name: this.formatTime(d.timestamp),
          value: d.temperature,
          extra: { alert: d.alert }
        }))
      },
      {
        name: 'Upper Limit (8°C)',
        series: this.temperatureData.map(d => ({
          name: this.formatTime(d.timestamp),
          value: this.tempUpperLimit
        }))
      },
      {
        name: 'Lower Limit (2°C)',
        series: this.temperatureData.map(d => ({
          name: this.formatTime(d.timestamp),
          value: this.tempLowerLimit
        }))
      }
    ];

    this.vibrationChartData = [
      {
        name: 'Safe Zone',
        series: this.vibrationData.map(d => ({
          name: this.formatTime(d.timestamp),
          value: this.vibrationSafeLimit
        }))
      },
      {
        name: 'Detected Vibration (g)',
        series: this.vibrationData.map(d => ({
          name: this.formatTime(d.timestamp),
          value: d.vibration,
          extra: { alert: d.alert }
        }))
      }
    ];
  }

  private calculateStats() {
    const temps = this.temperatureData.map(d => d.temperature);
    this.stats.temperature.min = Math.min(...temps);
    this.stats.temperature.max = Math.max(...temps);
    this.stats.temperature.avg = parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1));

    const vibs = this.vibrationData.map(d => d.vibration);
    this.stats.vibration.min = Math.min(...vibs);
    this.stats.vibration.max = Math.max(...vibs);
    this.stats.vibration.avg = parseFloat((vibs.reduce((a, b) => a + b, 0) / vibs.length).toFixed(1));
    this.stats.vibration.alertCount = this.vibrationData.filter(d => d.alert).length;
  }

  formatTime(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }

  formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('es-PE', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTemperatureAlerts() {
    return this.temperatureData.filter(d => d.alert);
  }

  getVibrationAlerts() {
    return this.vibrationData.filter(d => d.alert);
  }

  onChartSelect(event: any) {
    console.log('Chart selection:', event);
  }
}


