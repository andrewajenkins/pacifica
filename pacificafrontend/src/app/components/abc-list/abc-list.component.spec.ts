import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcListComponent } from './abc-list.component';

describe('AbcListComponent', () => {
  let component: AbcListComponent;
  let fixture: ComponentFixture<AbcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
