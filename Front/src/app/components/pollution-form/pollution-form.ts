import { Component, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PollutionData, PollutionType } from '../../models/pollution-model';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.scss'
})
export class PollutionFormComponent {
  pollutionSubmitted = output<PollutionData>();

  typesPollution: PollutionType[] = [
    'Plastique',
    'Chimique',
    'Dépôt sauvage',
    'Eau',
    'Air',
    'Autre'
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      typeAutre: [''],
      description: ['', Validators.required],
      date: ['', Validators.required],
      lieu: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: [null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      photoUrl: ['']
    });

    this.form.get('type')?.valueChanges.subscribe((typeValue) => {
      const typeAutreControl = this.form.get('typeAutre');
      if (typeValue === 'Autre') {
        typeAutreControl?.setValidators([Validators.required]);
      } else {
        typeAutreControl?.clearValidators();
        typeAutreControl?.setValue('');
      }
      typeAutreControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const finalType = formValue.type === 'Autre' ? formValue.typeAutre : formValue.type;

      const data: PollutionData = {
        titre: formValue.titre,
        type: finalType,
        description: formValue.description,
        date: formValue.date,
        lieu: formValue.lieu,
        latitude: Number(formValue.latitude),
        longitude: Number(formValue.longitude),
        photoUrl: formValue.photoUrl ? formValue.photoUrl : undefined
      };
      this.pollutionSubmitted.emit(data);
    } else {
      this.form.markAllAsTouched();
    }
  }
}