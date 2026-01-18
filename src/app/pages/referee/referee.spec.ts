import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Referee } from './referee';

describe('Referee', () => {
  let component: Referee;
  let fixture: ComponentFixture<Referee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Referee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Referee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
