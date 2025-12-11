import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material-module';
import { Observable } from 'rxjs';
import { ContaCorrenteService } from '../../services/conta-corrente.service';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent implements OnInit {
  public saldo$!: Observable<any>;
  
  @Output() menuToggleRequest = new EventEmitter<void>();

  constructor(private contaCorrenteService: ContaCorrenteService) {
    this.saldo$ = this.contaCorrenteService.saldoAtual$;    
  }

  ngOnInit(): void {
    this.contaCorrenteService.getSaldo().subscribe();
  }

  onMenuToggle() {
    this.menuToggleRequest.emit();
  }
}
