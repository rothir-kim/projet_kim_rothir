import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PollutionData } from '../../models/pollution-model';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.scss'
})
export class PollutionRecapComponent {
  data = input.required<PollutionData>();
  resetForm = output<void>();

  onNewDeclaration(): void {
    this.resetForm.emit();
  }
}