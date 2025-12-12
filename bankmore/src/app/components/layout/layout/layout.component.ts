import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ContaCorrenteService } from '../../../services/conta-corrente.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material-module';
import { MenuComponent } from '../menu/menu.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    RouterOutlet,
    MaterialModule,
    HttpClientModule,
    CommonModule,
    MenuComponent,
    ToolbarComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  
})
export class LayoutComponent implements OnInit {
  informacoes$: Observable<any> | undefined;
  saldo$: Observable<any> | undefined;

  constructor(private auth: AuthService, private contaService: ContaCorrenteService) {}

  ngOnInit(): void {
    this.informacoes$ = this.contaService.getInformacoes().pipe(
      tap({
        next: (data) => {
          
        },
        error: (err) => {
          console.error('Erro ao carregar dados:', err);
        }
      })
    );

    this.saldo$ = this.contaService.getSaldo().pipe(
      tap({
        next: (data) => {
          
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
