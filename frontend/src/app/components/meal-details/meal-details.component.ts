import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface Meal {
  id: number;
  name: string;
  category: string;
  price: string;
  ingredients: { id: number; name: string }[];
}
@Component({
  selector: 'app-meal-details',
  imports: [],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.scss'
})
export class MealDetailsComponent implements OnInit {
  meal: Meal | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const mealId = this.route.snapshot.paramMap.get('id');
    if (mealId) {
      this.http.get<Meal>(`http://localhost:9393/api/meals/${mealId}`).subscribe((meal) => {
        this.meal = meal;
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/meal-list']);
  }
}
