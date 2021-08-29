import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModeratorComponent } from './user-moderator.component';

describe('UserModeratorComponent', () => {
  let component: UserModeratorComponent;
  let fixture: ComponentFixture<UserModeratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModeratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModeratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
