import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContaCorrenteService {
  private baseApi = `${environment.apiBFF}/ContasCorrentes`;
  private api = {
    informacoes : `${this.baseApi}/informacoes`,
    saldo : `${this.baseApi}/saldo`,
    extrato: `${this.baseApi}/extrato`,
    debitar: `${this.baseApi}/debitar`,
  } 

  private saldoSubject = new BehaviorSubject<any>(null);
  saldoAtual$ = this.saldoSubject.asObservable();
  
  constructor(private http: HttpClient) { 
    this.getSaldo().subscribe();
  }

  getInformacoes(): Observable<any> {    
    return this.http.get<any>(this.api.informacoes);
  }

  getSaldo(): Observable<any> {
    return this.http.get<any>(this.api.saldo).pipe(
        tap(saldo => this.saldoSubject.next(saldo))
    );
}

  getExtrato(): Observable<any> {
    return this.http.get<any>(this.api.extrato);
  }

  postDebito(parametro: Movimentacao): Observable<any> {
    return this.http.post<any>(this.api.debitar, parametro);
  }

}
