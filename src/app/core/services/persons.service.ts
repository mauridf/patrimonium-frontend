import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Person, CreatePersonRequest, PersonType } from '../models/person.model';
import { PaginatedResponse, PaginationParams } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  private apiUrl = `${environment.apiUrl}/api/persons`;

  constructor(private http: HttpClient) {}

  // Listar pessoas com paginação
  getAll(params: PaginationParams = {}): Observable<Person[]> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    
    return this.http.get<Person[]>(this.apiUrl, { params: httpParams });
  }

  // Buscar por ID
  getById(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  // Criar pessoa
  create(person: CreatePersonRequest): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  // Atualizar pessoa
  update(id: string, person: CreatePersonRequest): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, person);
  }

  // Deletar pessoa (soft delete - a API pode não ter DELETE, verificar)
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}