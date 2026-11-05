import { FormControl } from '@angular/forms';
import { urlPhotoValide } from './url-photo.validateur';

describe('urlPhotoValide', () => {
  it('accepte un champ vide (la photo est facultative)', () => {
    expect(urlPhotoValide(new FormControl(''))).toBeNull();
  });

  it('accepte une URL http ou https', () => {
    expect(urlPhotoValide(new FormControl('https://exemple.fr/photo.jpg'))).toBeNull();
    expect(urlPhotoValide(new FormControl('http://exemple.fr/photo.jpg'))).toBeNull();
  });

  it('refuse le reste', () => {
    expect(urlPhotoValide(new FormControl('exemple.fr/photo.jpg'))).toEqual({ urlPhoto: true });
    expect(urlPhotoValide(new FormControl('javascript:alert(1)'))).toEqual({ urlPhoto: true });
  });
});
