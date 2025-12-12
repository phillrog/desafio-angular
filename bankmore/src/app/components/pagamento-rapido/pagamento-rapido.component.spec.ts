import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoRapidoComponent } from './pagamento-rapido.component';

describe('PagamentoRapidoComponent', () => {
  let component: PagamentoRapidoComponent;
  let fixture: ComponentFixture<PagamentoRapidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoRapidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoRapidoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
