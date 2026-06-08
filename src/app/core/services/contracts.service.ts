import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RentContract, CreateRentContractRequest, SaleContract, CreateSaleContractRequest } from '../models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private apiUrl = `${environment.apiUrl}/api/contracts`;

  constructor(private http: HttpClient) {}

  // RENT CONTRACTS
  getRentContracts(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.propertyId) httpParams = httpParams.set('propertyId', params.propertyId);
    return this.http.get(`${this.apiUrl}/rent`, { params: httpParams });
  }

  getRentContractById(id: string): Observable<RentContract> {
    return this.http.get<RentContract>(`${this.apiUrl}/rent/${id}`);
  }

  createRentContract(contract: CreateRentContractRequest): Observable<RentContract> {
    return this.http.post<RentContract>(`${this.apiUrl}/rent`, contract);
  }

  terminateRentContract(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/rent/${id}/terminate`, {});
  }

  // SALE CONTRACTS
  getSaleContracts(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.propertyId) httpParams = httpParams.set('propertyId', params.propertyId);
    return this.http.get(`${this.apiUrl}/sale`, { params: httpParams });
  }

  getSaleContractById(id: string): Observable<SaleContract> {
    return this.http.get<SaleContract>(`${this.apiUrl}/sale/${id}`);
  }

  createSaleContract(contract: CreateSaleContractRequest): Observable<SaleContract> {
    return this.http.post<SaleContract>(`${this.apiUrl}/sale`, contract);
  }

  completeSaleContract(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sale/${id}/complete`, {});
  }
}