import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealDto } from '../../shared/models/meal.dto';
import { environment } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-meal-details',
  imports: [],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.scss',
  standalone: true,
})
export class MealDetailsComponent implements OnInit {
  public meal: MealDto | null = null;

  public constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  public ngOnInit(): void {
    const mealId = this.route.snapshot.paramMap.get('id');
    if (mealId) {
      this.http.get<MealDto>(`${environment.apiUrl}/meals/${mealId}`).subscribe((meal) => {
        this.meal = meal;
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/meal-list']);
  }
}
