import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDetailsComponent } from './sheet-details.component';

describe('SheetDetailsComponent', () => {
  let component: SheetDetailsComponent;
  let fixture: ComponentFixture<SheetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
