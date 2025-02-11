package com.kiosk.backend.model;

import com.kiosk.backend.model.entity.Ingredient;
import com.kiosk.backend.model.entity.Meal;
import com.kiosk.backend.model.enums.MealCategories;
import jakarta.validation.Valid;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
@Component
public class MealModel {
    private final List<Meal> meals = new ArrayList<>();
    private final IngredientModel ingredientModel;

    public MealModel(IngredientModel ingredientModel) {
        this.ingredientModel = ingredientModel;
    }

    public List<Meal> getAllMeals() {
        return meals;
    }

    public List<MealCategories> getMealCategories() {
        return List.of(MealCategories.values());
    }

    public Meal addMeal(Meal meal) {
        meals.add(meal);
        return meal;
    }

    public Meal updateMeal(int id, @Valid Meal updatedMeal) {
        Meal existingMeal = getMealById(id).orElseThrow(() -> new NoSuchElementException("Meal not found with ID: " + id));
        existingMeal.setName(updatedMeal.getName());
        existingMeal.setPrice(updatedMeal.getPrice());
        existingMeal.setCategory(updatedMeal.getCategory());
        existingMeal.setIngredients(updatedMeal.getIngredients());
        return existingMeal;
    }

    public Optional<Meal> getMealById(int id) {
        return meals.stream().filter(meal -> meal.getId() == id).findFirst();
    }

    public boolean deleteMeal(int id) {
        return meals.removeIf(meal -> meal.getId() == id);
    }

    public List<Ingredient> getIngredientsByMealId(int mealId) {
        Meal meal = getMealById(mealId).orElseThrow(() -> new NoSuchElementException("Meal not found"));
        return meal.getIngredients();
    }

    public Ingredient addIngredientToMeal(int mealId, int ingredientId) {
        Meal meal = getMealById(mealId).orElseThrow(() -> new NoSuchElementException("Meal not found"));
        Ingredient ingredient = ingredientModel.getIngredientById(ingredientId);
        meal.getIngredients().add(ingredient);
        return ingredient;
    }

    public boolean deleteIngredientFromMeal(int mealId, int ingredientId) {
        Meal meal = getMealById(mealId).orElseThrow(() -> new NoSuchElementException("Meal not found"));
        return meal.getIngredients().removeIf(ingredient -> ingredient.getId() == ingredientId);
    }

    public double getPriceByName(String name) {
        return meals.stream()
                .filter(meal -> meal.getName().equals(name))
                .findFirst()
                .map(Meal::getPrice)
                .map(Double::parseDouble)
                .orElseThrow(() -> new IllegalArgumentException("Meal not found: " + name));
    }

}
