import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientselectorComponent } from './clientselector.component';

describe('ClientselectorComponent', () => {
  let component: ClientselectorComponent;
  let fixture: ComponentFixture<ClientselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
