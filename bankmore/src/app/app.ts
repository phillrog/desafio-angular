import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bankmore');
    
    constructor(private auth: AuthService) {}

    ngOnInit(): void {
      this.verifyAuthentication();
    }

    verifyAuthentication() {
        this.auth.isAuthenticated()
            .subscribe({
                next: (response) => {
                    console.log('Sessão ativa. App pode carregar o conteúdo.');
                },
                error: (err) => {
                    if (err.status !== 401) {
                         console.error('Erro de conexão ou servidor:', err);
                    }
                }
            });
    }    
}
