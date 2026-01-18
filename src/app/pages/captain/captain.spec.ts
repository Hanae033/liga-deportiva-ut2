import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Captain } from './captain';

describe('Captain', () => {
  let component: Captain;
  let fixture: ComponentFixture<Captain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Captain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Captain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
