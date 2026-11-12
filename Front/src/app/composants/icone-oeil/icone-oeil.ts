import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icone-oeil',
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      @if (barre()) {
        <line x1="2" y1="2" x2="22" y2="22" />
      }
    </svg>
  `,
})
export class IconeOeil {
  barre = input(false);
}
