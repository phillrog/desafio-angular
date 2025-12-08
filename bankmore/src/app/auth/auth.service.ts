import { Injectable, Inject, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiAuth; 
  private api = {
    login : `${this.baseUrl}/Account/Login`,
    statusUsuario:`${this.baseUrl}/api/status`,
    endSessionEndpoint: `${this.baseUrl}/connect/endsession?post_logout_redirect_uri=${encodeURIComponent(`${this.baseUrl}/home`)}`
  }

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public isAuthenticated(): Observable<boolean> {
    if (!this.isBrowser) {
      // Se não estiver no browser, não há como checar o cookie; retorna falso
      return of(false);
    }
    
    // Faz uma nova chamada HTTP para o endpoint protegido
    return this.http.get(this.api.statusUsuario, { withCredentials: true })
      .pipe(
        // Se a requisição for bem-sucedida (Status 200)
        map(() => {
          console.log('BFF Check: Sessão ativa (200).');
          return true; // Emite TRUE
        }),
        // Se a requisição falhar (ex: 401 ou erro de rede)
        catchError((error) => {
          if (error.status === 401) {
            console.warn('BFF Check: Sessão expirada (401).');
          } else {
            console.error('BFF Check: Erro de conexão/servidor.', error);
          }
          // Emite FALSE. Isso garante que o Observable COMPLETA, mas com o valor FALSE.
          return of(false); 
        })
      );
  }

  public startLoginFlow(): void {
    window.location.href = this.api.login;
  }

  public logout(): void {
    
    if (this.isBrowser) {
        window.location.href = this.api.endSessionEndpoint;
    }
  }
}