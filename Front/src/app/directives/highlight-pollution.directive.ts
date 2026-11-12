import { Directive, ElementRef, inject, Input, OnChanges } from '@angular/core';
import { NiveauPollution } from '../pipes/pollution-level.pipe';

const COULEURS: Record<NiveauPollution, string> = {
  Faible: '#bfe8b8',
  Modérée: '#fde68a',
  Élevée: '#fdba74',
  Dangereuse: '#f87171',
  Inconnu: '',
};

/** Colore le fond d'un élément selon le niveau de pollution. */
@Directive({
  selector: '[appHighlightPollution]',
})
export class HighlightPollutionDirective implements OnChanges {
  @Input() appHighlightPollution: NiveauPollution = 'Inconnu';

  private element = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnChanges(): void {
    this.element.nativeElement.style.backgroundColor = COULEURS[this.appHighlightPollution];
  }
}
