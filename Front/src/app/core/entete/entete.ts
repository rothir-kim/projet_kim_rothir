import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-entete',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './entete.html',
  styleUrl: './entete.scss',
})
export class Entete {
  private serviceUser = inject(UserService);
  private routeur = inject(Router);

  utilisateurConnecte = this.serviceUser.utilisateurConnecte;

  // On quitte d'abord la page (elle peut demander confirmation), puis on déconnecte
  seDeconnecter(): void {
    this.routeur.navigate(['/pollutions']).then((pageQuittee) => {
      if (pageQuittee !== false) {
        this.serviceUser.deconnecter();
      }
    });
  }
}
