import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PollutionService } from '../../services/pollution-service';

@Component({
  selector: 'app-detail-pollution',
  imports: [DatePipe, RouterLink],
  templateUrl: './detail-pollution.html',
  styleUrl: './detail-pollution.scss',
})
export class DetailPollution {
  private servicePollution = inject(PollutionService);
  private id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  introuvable = signal(false);

  pollution = toSignal(
    this.servicePollution.obtenir(this.id).pipe(
      catchError(() => {
        this.introuvable.set(true);
        return of(null);
      }),
    ),
    { initialValue: null },
  );
}
