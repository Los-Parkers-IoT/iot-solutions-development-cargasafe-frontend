import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Trip, Alert, IncidentsByMonthData } from '../domain/model';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  async exportDashboardToPdf(
    trips: Trip[],
    alerts: Alert[],
    incidentsData: IncidentsByMonthData[]
  ): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text('CargaSafe Analytics Report', margin, yPosition);
    yPosition += 10;

    // Date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`Generated: ${currentDate}`, margin, yPosition);
    yPosition += 15;

    // Summary Statistics
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Summary Statistics', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    const activeTrips = trips.filter(t => t.status === 'IN_PROGRESS' || t.status === 'COMPLETED').length;
    const totalAlerts = alerts.length;
    const pendingAlerts = alerts.filter(a => !a.resolved).length;

    const stats = [
      `Total Trips: ${trips.length}`,
      `Active Trips: ${activeTrips}`,
      `Total Alerts: ${totalAlerts}`,
      `Pending Alerts: ${pendingAlerts}`
    ];

    stats.forEach(stat => {
      pdf.text(stat, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Trips Table
    if (trips.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Recent Trips', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      
      // Table headers
      const headers = ['Vehicle', 'Origin', 'Destination', 'Status', 'Distance'];
      const colWidths = [35, 40, 40, 30, 25];
      let xPosition = margin;

      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F');
      
      pdf.setTextColor(60, 60, 60);
      headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += 8;

      // Table rows
      pdf.setTextColor(80, 80, 80);
      trips.slice(0, 10).forEach((trip, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        xPosition = margin;
        const rowData = [
          trip.vehiclePlate,
          this.truncate(trip.origin, 15),
          this.truncate(trip.destination, 15),
          this.getStatusText(trip.status),
          `${trip.distance} km`
        ];

        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F');
        }

        rowData.forEach((data, i) => {
          pdf.text(data, xPosition, yPosition);
          xPosition += colWidths[i];
        });
        yPosition += 7;
      });

      yPosition += 10;
    }

    // Incidents by Month
    if (incidentsData.length > 0 && yPosition < pageHeight - 60) {
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Incidents by Month', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      
      const incidentHeaders = ['Month', 'Temperature', 'Movement', 'Total'];
      const incidentColWidths = [40, 40, 40, 40];
      let xPos = margin;

      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F');
      
      pdf.setTextColor(60, 60, 60);
      incidentHeaders.forEach((header, index) => {
        pdf.text(header, xPos, yPosition);
        xPos += incidentColWidths[index];
      });
      yPosition += 8;

      pdf.setTextColor(80, 80, 80);
      incidentsData.forEach((incident, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        xPos = margin;
        const total = incident.temperatureIncidents + incident.movementIncidents;
        const rowData = [
          incident.month,
          incident.temperatureIncidents.toString(),
          incident.movementIncidents.toString(),
          total.toString()
        ];

        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F');
        }

        rowData.forEach((data, i) => {
          pdf.text(data, xPos, yPosition);
          xPos += incidentColWidths[i];
        });
        yPosition += 7;
      });
    }

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const fileName = `cargasafe-analytics-${new Date().getTime()}.pdf`;
    pdf.save(fileName);
  }

  private truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  }

  private getStatusText(status: string): string {
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
}
