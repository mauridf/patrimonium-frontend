import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction, CreateTransactionRequest } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = `${environment.apiUrl}/api/transactions`;

  constructor(private http: HttpClient) {}

  getAll(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.propertyId) httpParams = httpParams.set('propertyId', params.propertyId);
    if (params.status) httpParams = httpParams.set('status', params.status);
    return this.http.get(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  create(transaction: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  pay(id: string, paymentDate?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/pay`, {
      paymentDate: paymentDate || new Date().toISOString()
    });
  }

  cancel(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}