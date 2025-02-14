import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-banner',
  imports: [],
  templateUrl: './ad-banner.component.html',
  styleUrl: './ad-banner.component.scss',
  standalone: true
})
export class AdBannerComponent {
  private adUrl = 'https://mcdonalds.pl/dni--zmakowanych/';

  public constructor(private router: Router) {}

  public goToAd(): void {
    window.open(this.adUrl, '_blank');
  }
}
