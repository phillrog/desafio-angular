import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContaCorrenteService {
  private baseApi = `${environment.apiBFF}/ContasCorrentes`;
  private api = {
    informacoes : `${this.baseApi}/informacoes`,
    saldo : `${this.baseApi}/saldo`,
    extrato: `${this.baseApi}/extrato`,
  } 

  constructor(private http: HttpClient) { }

  getInformacoes(): Observable<any> {    
    return this.http.get<any>(this.api.informacoes);
  }

  getSaldo(): Observable<any> {
    return this.http.get<any>(this.api.saldo);
  }

  getExtrato(): Observable<any> {
    return this.http.get<any>(this.api.extrato);
  }
}
