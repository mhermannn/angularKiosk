import { Component, Input } from '@angular/core';
import { AbstractControl} from '@angular/forms';
@Component({
  selector: 'app-validation-error',
  standalone: true,
  imports: [],
  templateUrl: './validation-error.component.html',
  styleUrl: './validation-error.component.scss'
})
export class ValidationErrorComponent {
  @Input() control: AbstractControl | null = null;

}
