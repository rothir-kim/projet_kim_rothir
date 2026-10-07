import { ComponentFixture, TestBed } from '@angular/core';
import { PollutionRecapComponent } from './pollution-recap';

describe('PollutionRecapComponent', () => {
  let component: PollutionRecapComponent;
  let fixture: ComponentFixture<PollutionRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionRecapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PollutionRecapComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      titre: 'Test Pollution',
      type: 'Plastique',
      description: 'Description test',
      date: '2026-03-30',
      lieu: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});