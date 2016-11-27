import {Injectable} from '@angular/core';

@Injectable()
export class ValidateService {

  /**
   * 
   */
  validateNameFields(nameFields: HTMLInputElement[]): boolean {
    let isValid = true;
    for(let i = 0; i < nameFields.length; i++){ 
      if(!nameFields[i].value || nameFields[i].value.length > 30){
        nameFields[i].classList.add('field-input-invalid');
        isValid = false;
      } else {
        nameFields[i].classList.remove('field-input-invalid');
      }
    }
    return isValid;
  }

  /**
   * 
   */
  validateInputFields(fields: HTMLInputElement[]): boolean {
    let isValid = true;
    for(let i = 0; i < fields.length; i++){
        if(!fields[i].value){
          fields[i].classList.add('field-input-invalid'); 
          isValid = false;
        } else {
          fields[i].classList.remove('field-input-invalid'); 
        }
      }
      return isValid;
  }
}
