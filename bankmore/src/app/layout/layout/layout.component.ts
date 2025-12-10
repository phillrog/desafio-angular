import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ContaCorrenteService } from '../../services/conta-corrente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  
})
export class LayoutComponent implements OnInit {
  informacoes$: Observable<any> | undefined;

  constructor(private auth: AuthService, private contaService: ContaCorrenteService) {}

  ngOnInit(): void {
    this.informacoes$ = this.contaService.getInformacoes().pipe(
      tap({
      next: (data) => {
        console.log('Dados do usuário carregados:', data);
        
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
      }
    })
    );
  }
  
  logout(){
    this.auth.logout();
  }
}
