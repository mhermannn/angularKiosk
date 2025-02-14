import { IngredientDto } from './ingredient.dto';
import { MealCategories } from '../enums/meal-categories';
export interface MealDto {
  id: number;
  readonly name: string;
  readonly category: MealCategories;
  readonly price: string;
  readonly ingredients: IngredientDto[];
}