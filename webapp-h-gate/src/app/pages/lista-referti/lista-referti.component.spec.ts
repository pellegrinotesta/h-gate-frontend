import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRefertiComponent } from './lista-referti.component';

describe('ListaRefertiComponent', () => {
  let component: ListaRefertiComponent;
  let fixture: ComponentFixture<ListaRefertiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaRefertiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaRefertiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
