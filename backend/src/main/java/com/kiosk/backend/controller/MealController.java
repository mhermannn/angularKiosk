package com.kiosk.backend.controller;

import com.kiosk.backend.model.entity.Ingredient;
import com.kiosk.backend.model.entity.Meal;
import com.kiosk.backend.service.KioskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/meals")
public class MealController {
    private final KioskService kioskService;

    @Autowired
    public MealController(KioskService kioskService) {
        this.kioskService = kioskService;
    }

    @GetMapping
    public ResponseEntity<List<Meal>> getAllMeals() {
        List<Meal> meals = kioskService.getMealModel().getAllMeals();
        return ResponseEntity.ok(meals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meal> getMealById(@PathVariable int id) {
        Optional<Meal> meal = kioskService.getMealModel().getMealById(id);
        return meal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Meal> addMeal(@RequestBody Meal meal) {
        Meal addedMeal = kioskService.getMealModel().addMeal(meal);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedMeal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meal> updateMeal(@PathVariable int id, @RequestBody Meal meal) {
        try {
            Meal updatedMeal = kioskService.getMealModel().updateMeal(id, meal);
            return ResponseEntity.ok(updatedMeal);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable int id) {
        boolean deleted = kioskService.getMealModel().deleteMeal(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{mealId}/ingredients/{ingredientId}")
    public ResponseEntity<Meal> addIngredientToMeal(@PathVariable int mealId, @PathVariable int ingredientId) {
        try {
            Ingredient ingredient = kioskService.getIngredientModel().getIngredientById(ingredientId);
            Meal meal = kioskService.getMealModel().getMealById(mealId).orElseThrow();
            meal.getIngredients().add(ingredient);
            kioskService.getMealModel().updateMeal(mealId, meal);
            return ResponseEntity.ok(meal);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{mealId}/ingredients/{ingredientId}")
    public ResponseEntity<Meal> removeIngredientFromMeal(@PathVariable int mealId, @PathVariable int ingredientId) {
        try {
            Meal meal = kioskService.getMealModel().getMealById(mealId).orElseThrow();
            meal.getIngredients().removeIf(ingredient -> ingredient.getId() == ingredientId);
            kioskService.getMealModel().updateMeal(mealId, meal);
            return ResponseEntity.ok(meal);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}