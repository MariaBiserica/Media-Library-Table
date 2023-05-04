import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static descriptionWordsCount(minWords: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value.trim() === '') {
        return null;
      }
      const words = value.trim().split(/\s+/);
      if (words.length < minWords) {
        return { wordsCount: true };
      }
      return null;
    };
  }  

  static ratingRange(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || isNaN(value)) {
        return null;
      }
      if (value < min || value > max) {
        return { range: true };
      }
      return null;
    };
  }

  static posterUrl(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value.trim() === '') {
      return null;
    }
    const pattern = /^https?:\/\/\S+\.(jpg|jpeg|png)$/i;
    if (!pattern.test(value)) {
      return { url: true };
    }
    return null;
  }
}
