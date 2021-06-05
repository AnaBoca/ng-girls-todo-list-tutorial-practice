import {AbstractControl, ValidatorFn} from '@angular/forms';

export function notEmpty(): ValidatorFn {
  return (control: AbstractControl) => {
    const required = {required: true};
    if (!control.value) {
      return required;
    }

    const trimmedValue = control.value.trim();
    if(!trimmedValue) {
      return required;
    }
    return null;
  }
}
