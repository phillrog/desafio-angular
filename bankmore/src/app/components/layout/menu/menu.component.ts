import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../../shared/material-module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav-menu',
  imports: [MaterialModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  @Input() informacoes: any; 
  
  @Output() logoutRequest = new EventEmitter<void>();

  onLogout() {
    this.logoutRequest.emit();
  }
}
