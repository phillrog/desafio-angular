import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferenciasService {
  private baseApi = `${environment.apiBFF}/Transferencias`;
  private api = {
    transferir : `${this.baseApi}/transferir`,
  } 

  private saldoSubject = new BehaviorSubject<any>(null);
  saldoAtual$ = this.saldoSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  postTransferir(parametro: any): Observable<any> {
    return this.http.post<any>(this.api.transferir, parametro);
  }

}
