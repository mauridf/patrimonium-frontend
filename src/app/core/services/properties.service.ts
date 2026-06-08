import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Property, CreatePropertyRequest, PropertyImage } from '../models/property.model';
import { PaginationParams } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  private apiUrl = `${environment.apiUrl}/api/properties`;

  constructor(private http: HttpClient) {}

  // Listar propriedades com paginação e filtros
  getAll(params: PaginationParams & { ownerId?: string } = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.ownerId) httpParams = httpParams.set('ownerId', params.ownerId);
    
    return this.http.get(this.apiUrl, { params: httpParams });
  }

  // Buscar por ID
  getById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  // Criar propriedade
  create(property: CreatePropertyRequest): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  // Atualizar propriedade
  update(id: string, property: Partial<CreatePropertyRequest>): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, property);
  }

  // Deletar (soft delete)
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Upload de imagem
  uploadImage(propertyId: string, file: File): Observable<PropertyImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<PropertyImage>(`${this.apiUrl}/${propertyId}/images`, formData);
  }

  // Listar imagens
  getImages(propertyId: string): Observable<PropertyImage[]> {
    return this.http.get<PropertyImage[]>(`${this.apiUrl}/${propertyId}/images`);
  }

  // Deletar imagem
  deleteImage(propertyId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${propertyId}/images/${imageId}`);
  }

  // Upload de documento
  uploadDocument(propertyId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${propertyId}/documents`, formData);
  }
}