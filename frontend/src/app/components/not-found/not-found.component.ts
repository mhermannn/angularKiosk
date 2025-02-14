import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  standalone: true,
})
export class NotFoundComponent {
  public constructor(private router: Router) {}

  public goBack(): void {
    this.router.navigate(['/']);
  }

}
