import { Component, signal } from '@angular/core';
import { PollutionFormComponent } from './components/pollution-form/pollution-form';
import { PollutionRecapComponent } from './components/pollution-recap/pollution-recap';
import { PollutionData } from './models/pollution-model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PollutionFormComponent, PollutionRecapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  currentPollution = signal<PollutionData | null>(null);

  onPollutionSubmitted(data: PollutionData): void {
    this.currentPollution.set(data);
  }

  onResetForm(): void {
    this.currentPollution.set(null);
  }
}