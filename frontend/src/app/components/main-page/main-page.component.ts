import { Component } from '@angular/core';
import { AdBannerComponent } from "../ad-banner/ad-banner.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [AdBannerComponent,RouterModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
