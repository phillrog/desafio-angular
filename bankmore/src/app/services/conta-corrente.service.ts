import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ContaCorrenteService {
  private apiUrl = 'http://localhost:5003/api/v1/ContasCorrentes/informacoes'; 

  constructor(private http: HttpClient) { }

  getInformacoes(): Observable<any> {    
    return this.http.get<any>(this.apiUrl);
  }
}
