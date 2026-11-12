import { FormControl, FormGroup } from '@angular/forms';
import { motDePasseRobuste, motsDePasseIdentiques } from './mot-de-passe.validateur';

describe('motDePasseRobuste', () => {
  it('accepte un mot de passe qui respecte tous les critères', () => {
    expect(motDePasseRobuste(new FormControl('Abcdef1!'))).toBeNull();
  });

  it('refuse un mot de passe trop faible', () => {
    expect(motDePasseRobuste(new FormControl('abcdef1!'))).toEqual({ motDePasseFaible: true });
    expect(motDePasseRobuste(new FormControl('Abcdefgh'))).toEqual({ motDePasseFaible: true });
    expect(motDePasseRobuste(new FormControl('Ab1!'))).toEqual({ motDePasseFaible: true });
  });
});

describe('motsDePasseIdentiques', () => {
  const formulaire = (motDePasse: string, confirmation: string) =>
    new FormGroup({ motDePasse: new FormControl(motDePasse), confirmation: new FormControl(confirmation) });

  it('accepte deux mots de passe identiques', () => {
    expect(motsDePasseIdentiques(formulaire('Abcdef1!', 'Abcdef1!'))).toBeNull();
  });

  it('refuse deux mots de passe différents', () => {
    expect(motsDePasseIdentiques(formulaire('Abcdef1!', 'Autre1!x'))).toEqual({
      confirmationDifferente: true,
    });
  });
});
