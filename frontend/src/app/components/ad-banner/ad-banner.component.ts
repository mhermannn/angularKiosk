import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ad-banner',
  imports: [],
  templateUrl: './ad-banner.component.html',
  styleUrl: './ad-banner.component.scss',
})
export class AdBannerComponent {
  private adUrl = 'https://mcdonalds.pl/';

  constructor(private router: Router) {}

  goToAd() {
    window.open(this.adUrl, '_blank');
  }

}
