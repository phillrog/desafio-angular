import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../shared/material-module';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  @Input() saldo: any; 
  
  @Output() menuToggleRequest = new EventEmitter<void>();

  onMenuToggle() {
    this.menuToggleRequest.emit();
  }
}
