import { IngredientDto } from './ingredient.dto';
import { MealCategories } from '../enums/meal-categories';
export interface MealDto {
  id: number;
  name: string;
  category: MealCategories;
  price: string;
  ingredients: IngredientDto[];
}