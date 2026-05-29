import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummary, OverdueReport, ROIReport } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  // Resumo financeiro
  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  // Relatório de inadimplência
  getOverdue(): Observable<OverdueReport[]> {
    return this.http.get<OverdueReport[]>(`${this.apiUrl}/overdue`);
  }

  // Relatório de ROI
  getROI(): Observable<ROIReport[]> {
    return this.http.get<ROIReport[]>(`${this.apiUrl}/roi`);
  }
}