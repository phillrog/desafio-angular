import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MaterialModule } from './shared/material-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
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
