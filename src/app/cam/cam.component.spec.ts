import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamComponent } from './cam.component';

describe('CamComponent', () => {
  let component: CamComponent;
  let fixture: ComponentFixture<CamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
