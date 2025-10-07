import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentsByMonthData, Alert, AlertType } from '../../models/trip.model';

@Component({
  selector: 'app-incidents-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="incidents-chart">
      <div class="incidents-chart__header">
        <h2>Incidencias por Mes</h2>
        <div class="chart-filters">
          <div class="date-range-filters">
            <label for="startDate">Fecha Inicio:</label>
            <input 
              id="startDate"
              type="date" 
              [(ngModel)]="startDate"
              (change)="filterByDateRange()"
              class="date-filter">
            
            <label for="endDate">Fecha Fin:</label>
            <input 
              id="endDate"
              type="date" 
              [(ngModel)]="endDate"
              (change)="filterByDateRange()"
              class="date-filter">
          </div>
          
          <select [(ngModel)]="alertTypeFilter" (change)="filterByAlertType()" class="alert-type-filter">
            <option value="">Todos los tipos</option>
            <option value="TEMPERATURE">Temperatura</option>
            <option value="MOVEMENT">Movimiento</option>
          </select>
        </div>
      </div>

      <div class="incidents-chart__content" *ngIf="!loading; else loadingTemplate">
        <div class="chart-container">
          <canvas 
            #chartCanvas
            class="chart-canvas"
            (mousemove)="onMouseMove($event)"
            (mouseleave)="hideTooltip()">
          </canvas>
          
          <!-- Tooltip -->
          <div 
            class="chart-tooltip" 
            [style.display]="tooltipVisible ? 'block' : 'none'"
            [style.left.px]="tooltipX"
            [style.top.px]="tooltipY">
            <div class="tooltip-content" *ngIf="tooltipData">
              <h4>{{ tooltipData.month }} {{ tooltipData.year }}</h4>
              <div class="tooltip-incidents">
                <div class="incident-item">
                  <span class="incident-type temperature">Temperatura:</span>
                  <span class="incident-count">{{ tooltipData.temperatureIncidents }}</span>
                </div>
                <div class="incident-item">
                  <span class="incident-type movement">Movimiento:</span>
                  <span class="incident-count">{{ tooltipData.movementIncidents }}</span>
                </div>
                <div class="incident-total">
                  <strong>Total: {{ tooltipData.totalIncidents }}</strong>
                </div>
              </div>
              
              <!-- Detalles de incidencias -->
              <div class="incident-details" *ngIf="tooltipData.incidents.length > 0">
                <h5>Detalles de Incidencias:</h5>
                <div class="incident-list">
                  <div 
                    class="incident-detail" 
                    *ngFor="let incident of tooltipData.incidents.slice(0, 3)">
                    <div class="incident-info">
                      <span class="incident-date">{{ incident.timestamp | date:'short' }}</span>
                      <span class="incident-vehicle">{{ incident.vehiclePlate }}</span>
                      <span class="incident-device">IOT: {{ incident.deviceId }}</span>
                      <span class="incident-type-badge" [ngClass]="incident.type.toLowerCase()">
                        {{ getAlertTypeText(incident.type) }}
                      </span>
                    </div>
                  </div>
                  <div *ngIf="tooltipData.incidents.length > 3" class="more-incidents">
                    +{{ tooltipData.incidents.length - 3 }} más...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color temperature"></div>
            <span>Incidencias de Temperatura</span>
          </div>
          <div class="legend-item">
            <div class="legend-color movement"></div>
            <span>Incidencias de Movimiento</span>
          </div>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading">
          <p>Cargando datos del gráfico...</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./incidents-chart.component.css']
})
export class IncidentsChartComponent implements AfterViewInit, OnChanges {
  @Input() data: IncidentsByMonthData[] = [];
  @Input() loading = false;
  @ViewChild('chartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  filteredData: IncidentsByMonthData[] = [];
  selectedMonth = '';
  alertTypeFilter = '';
  startDate = '';
  endDate = '';
  
  // Tooltip
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: IncidentsByMonthData | null = null;

  // Chart dimensions
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private chartWidth = 0;
  private chartHeight = 0;
  private barWidth = 0;
  private maxValue = 0;

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.filteredData = this.sortDataByDate([...this.data]);
    if (this.canvas) {
      this.drawChart();
    }
  }

  private sortDataByDate(data: IncidentsByMonthData[]): IncidentsByMonthData[] {
    // Remove duplicates first, keeping the entry with more data
    const uniqueData = this.removeDuplicates(data);
    
    return uniqueData.sort((a, b) => {
      // Convert month names to numbers for proper sorting
      const monthOrder = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      
      const aMonthIndex = monthOrder.indexOf(a.month);
      const bMonthIndex = monthOrder.indexOf(b.month);
      
      // First sort by year
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      
      // Then sort by month
      return aMonthIndex - bMonthIndex;
    });
  }

  private removeDuplicates(data: IncidentsByMonthData[]): IncidentsByMonthData[] {
    const uniqueMap = new Map<string, IncidentsByMonthData>();
    
    data.forEach(item => {
      const key = `${item.year}-${item.month}`;
      const existing = uniqueMap.get(key);
      
      if (!existing || item.totalIncidents > existing.totalIncidents) {
        uniqueMap.set(key, item);
      }
    });
    
    return Array.from(uniqueMap.values());
  }

  private initChart() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Set canvas size dynamically based on container and number of months
    const container = this.canvas.parentElement;
    const containerWidth = container ? container.offsetWidth : 1200;
    
    // Ensure minimum width for 12 months (100px per month minimum)
    const minWidth = Math.max(1200, this.data.length * 100);
    this.canvas.width = Math.min(containerWidth - 20, minWidth);
    this.canvas.height = 500; // Increased height for better visualization
    
    this.chartWidth = this.canvas.width - 120; // More margin for labels
    this.chartHeight = this.canvas.height - 120; // More margin for labels
    
    this.filteredData = this.sortDataByDate([...this.data]);
    this.drawChart();
  }

  private drawChart() {
    if (!this.ctx) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.filteredData.length === 0) {
      return;
    }

    // Calculate dimensions with better spacing
    const totalMonths = this.filteredData.length;
    const spaceBetweenGroups = 30; // Space between month groups
    const spaceBetweenBars = 8; // Space between temperature and movement bars
    const availableWidth = this.chartWidth - (spaceBetweenGroups * (totalMonths + 1));
    
    this.barWidth = Math.max(20, availableWidth / (totalMonths * 2)); // Minimum 20px width per bar
    
    // Calculate max value based on filter
    if (this.alertTypeFilter === 'TEMPERATURE') {
      this.maxValue = Math.max(...this.filteredData.map(d => d.temperatureIncidents));
    } else if (this.alertTypeFilter === 'MOVEMENT') {
      this.maxValue = Math.max(...this.filteredData.map(d => d.movementIncidents));
    } else {
      this.maxValue = Math.max(...this.filteredData.map(d => Math.max(d.temperatureIncidents, d.movementIncidents)));
    }

    // Draw axes
    this.drawAxes();

    // Draw bars
    this.drawBars();

    // Draw labels
    this.drawLabels();
  }

  private drawAxes() {
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 1;

    // Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(50, 60);
    this.ctx.lineTo(50, this.chartHeight + 60);
    this.ctx.stroke();

    // X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(50, this.chartHeight + 60);
    this.ctx.lineTo(this.chartWidth + 50, this.chartHeight + 60);
    this.ctx.stroke();
  }

  private drawBars() {
    const spaceBetweenGroups = 30;
    const spaceBetweenBars = 8;
    const startX = 60;
    
    this.filteredData.forEach((monthData, index) => {
      const groupX = startX + (index * (this.barWidth * 2 + spaceBetweenBars + spaceBetweenGroups));
      
      // Temperature bars (red) - show only if no filter or filter is TEMPERATURE
      if (!this.alertTypeFilter || this.alertTypeFilter === 'TEMPERATURE') {
        const tempHeight = (monthData.temperatureIncidents / this.maxValue) * this.chartHeight;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(groupX, this.chartHeight + 60 - tempHeight, this.barWidth, tempHeight);
      }

      // Movement bars (blue) - show only if no filter or filter is MOVEMENT
      if (!this.alertTypeFilter || this.alertTypeFilter === 'MOVEMENT') {
        const movHeight = (monthData.movementIncidents / this.maxValue) * this.chartHeight;
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.fillRect(groupX + this.barWidth + spaceBetweenBars, this.chartHeight + 60 - movHeight, this.barWidth, movHeight);
      }
    });
  }

  private drawLabels() {
    this.ctx.fillStyle = '#374151';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';

    // Month labels
    const spaceBetweenGroups = 30;
    const spaceBetweenBars = 8;
    const startX = 60;
    
    this.filteredData.forEach((monthData, index) => {
      const groupX = startX + (index * (this.barWidth * 2 + spaceBetweenBars + spaceBetweenGroups));
      const centerX = groupX + this.barWidth + spaceBetweenBars / 2;
      this.ctx.fillText(monthData.month.substring(0, 3), centerX, this.chartHeight + 85);
    });

    // Y-axis labels
    this.ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (this.maxValue / 5) * i;
      const y = this.chartHeight + 60 - (i * (this.chartHeight / 5));
      this.ctx.fillText(Math.round(value).toString(), 45, y + 4);
    }
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if mouse is over a bar
    const monthIndex = this.getMonthIndexFromX(x);
    const barInfo = this.getBarInfoFromPosition(x, y);
    
    if (monthIndex >= 0 && monthIndex < this.filteredData.length && barInfo.isOverBar) {
      // Use relative positioning to the chart container
      const containerRect = this.canvas.parentElement?.getBoundingClientRect();
      if (containerRect) {
        const relativeX = event.clientX - containerRect.left;
        const relativeY = event.clientY - containerRect.top;
        this.showTooltip(relativeX, relativeY, this.filteredData[monthIndex]);
      }
    } else {
      this.hideTooltip();
    }
  }

  private getMonthIndexFromX(x: number): number {
    const startX = 60;
    const spaceBetweenGroups = 30;
    const spaceBetweenBars = 8;

    for (let i = 0; i < this.filteredData.length; i++) {
      const groupX = startX + (i * (this.barWidth * 2 + spaceBetweenBars + spaceBetweenGroups));
      const groupEndX = groupX + (this.barWidth * 2) + spaceBetweenBars;
      
      if (x >= groupX && x <= groupEndX) {
        return i;
      }
    }
    return -1;
  }

  private getBarInfoFromPosition(x: number, y: number): { isOverBar: boolean, barType?: 'temperature' | 'movement' } {
    const startX = 60;
    const spaceBetweenGroups = 30;
    const spaceBetweenBars = 8;
    const chartBottom = this.chartHeight + 60;

    for (let i = 0; i < this.filteredData.length; i++) {
      const monthData = this.filteredData[i];
      const groupX = startX + (i * (this.barWidth * 2 + spaceBetweenBars + spaceBetweenGroups));
      
      // Temperature bar - only check if it should be visible
      if (!this.alertTypeFilter || this.alertTypeFilter === 'TEMPERATURE') {
        const tempBarX = groupX;
        const tempBarHeight = (monthData.temperatureIncidents / this.maxValue) * this.chartHeight;
        const tempBarTop = chartBottom - tempBarHeight;
        
        // Add tolerance for better user experience
        const tolerance = 5;
        if (x >= tempBarX - tolerance && x <= tempBarX + this.barWidth + tolerance && 
            y >= tempBarTop - tolerance && y <= chartBottom + tolerance && 
            tempBarHeight > 0) {
          return { isOverBar: true, barType: 'temperature' };
        }
      }

      // Movement bar - only check if it should be visible
      if (!this.alertTypeFilter || this.alertTypeFilter === 'MOVEMENT') {
        const movBarX = groupX + this.barWidth + spaceBetweenBars;
        const movBarHeight = (monthData.movementIncidents / this.maxValue) * this.chartHeight;
        const movBarTop = chartBottom - movBarHeight;
        
        // Add tolerance for better user experience
        const tolerance = 5;
        if (x >= movBarX - tolerance && x <= movBarX + this.barWidth + tolerance && 
            y >= movBarTop - tolerance && y <= chartBottom + tolerance && 
            movBarHeight > 0) {
          return { isOverBar: true, barType: 'movement' };
        }
      }
    }
    
    return { isOverBar: false };
  }

  showTooltip(x: number, y: number, data: IncidentsByMonthData) {
    // Offset the tooltip to avoid covering the cursor
    this.tooltipX = x + 15;
    this.tooltipY = y - 10;
    
    // Ensure tooltip doesn't go off-screen
    const containerWidth = this.canvas.parentElement?.offsetWidth || 800;
    const tooltipWidth = 300; // max-width from CSS
    
    if (this.tooltipX + tooltipWidth > containerWidth) {
      this.tooltipX = x - tooltipWidth - 15;
    }
    
    if (this.tooltipY < 0) {
      this.tooltipY = y + 15;
    }
    
    this.tooltipData = data;
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  filterByMonth() {
    if (this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-');
      const filteredData = this.data.filter(d => 
        d.year === parseInt(year) && 
        (d.month === this.getMonthName(parseInt(month) - 1))
      );
      this.filteredData = this.sortDataByDate(filteredData);
    } else {
      this.filteredData = this.sortDataByDate([...this.data]);
    }
    this.drawChart();
  }

  filterByAlertType() {
    // Apply the current filters but adjust visibility based on alert type
    this.applyAllFilters();
  }

  filterByDateRange() {
    this.applyAllFilters();
  }

  private applyAllFilters() {
    let filtered = [...this.data];

    // Apply date range filter
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      
      filtered = filtered.filter(d => {
        const monthIndex = this.getMonthIndex(d.month);
        const dataDate = new Date(d.year, monthIndex, 1);
        return dataDate >= startDate && dataDate <= endDate;
      });
    } else if (this.startDate) {
      const startDate = new Date(this.startDate);
      filtered = filtered.filter(d => {
        const monthIndex = this.getMonthIndex(d.month);
        const dataDate = new Date(d.year, monthIndex, 1);
        return dataDate >= startDate;
      });
    } else if (this.endDate) {
      const endDate = new Date(this.endDate);
      filtered = filtered.filter(d => {
        const monthIndex = this.getMonthIndex(d.month);
        const dataDate = new Date(d.year, monthIndex, 1);
        return dataDate <= endDate;
      });
    }

    this.filteredData = this.sortDataByDate(filtered);
    this.drawChart();
  }

  private getMonthName(monthIndex: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
  }

  private getMonthIndex(monthName: string): number {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months.indexOf(monthName);
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