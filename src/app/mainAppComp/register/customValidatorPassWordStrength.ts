import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSymbols = /[!@#$%^&*()?{}]/.test(value);
  let has8Char = false;
  if(value.length === 8){
    has8Char = true
  }

  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSymbols && has8Char;

  return !passwordValid ? { passwordStrength: true } : null;
}
