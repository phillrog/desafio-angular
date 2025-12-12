import { TestBed } from '@angular/core/testing';
import { TransferenciasService } from './transferencias.service';


describe('ContaCorrente', () => {
  let service: TransferenciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferenciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
