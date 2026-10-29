import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FILTRES_VIDES, Filtres } from '../../modeles/filtres.modele';
import { TYPES_POLLUTION, TypePollution } from '../../modeles/pollution.modele';

@Component({
  selector: 'app-filtres-pollution',
  imports: [FormsModule],
  templateUrl: './filtres-pollution.html',
  styleUrl: './filtres-pollution.scss',
})
export class FiltresPollution {
  readonly types = TYPES_POLLUTION;
  filtres = input.required<Filtres>();
  filtresChange = output<Filtres>();

  changerLieu(lieu: string): void {
    this.filtresChange.emit({ ...this.filtres(), lieu });
  }

  changerType(type: TypePollution | ''): void {
    this.filtresChange.emit({ ...this.filtres(), type });
  }

  changerDateDebut(dateDebut: string): void {
    this.filtresChange.emit({ ...this.filtres(), dateDebut });
  }

  changerDateFin(dateFin: string): void {
    this.filtresChange.emit({ ...this.filtres(), dateFin });
  }

  reinitialiser(): void {
    this.filtresChange.emit({ ...FILTRES_VIDES });
  }
}
