package com.kiosk.backend.controller;

import com.kiosk.backend.model.entity.Ingredient;
import com.kiosk.backend.model.entity.Meal;
import com.kiosk.backend.service.KioskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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
    public ResponseEntity<?> addMeal(@RequestBody Meal meal, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can add meals");
        }

        try {
            validateIngredients(meal.getIngredients());
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Invalid ingredient: " + e.getMessage());
        }

        Meal addedMeal = kioskService.getMealModel().addMeal(meal);
        kioskService.saveMealsToCSV();
        return ResponseEntity.status(HttpStatus.CREATED).body(addedMeal);
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private void validateIngredients(List<Ingredient> ingredients) {
        for (Ingredient ingredient : ingredients) {
            kioskService.getIngredientModel().getIngredientById(ingredient.getId());
        }
    }

    @GetMapping("/ingredients")
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        List<Ingredient> ingredients = kioskService.getIngredientModel().getAllIngredients();
        return ResponseEntity.ok(ingredients);
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
    public ResponseEntity<Map<String, String>> deleteMeal(@PathVariable int id, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Only admins can delete meals"));
        }
        boolean deleted = kioskService.getMealModel().deleteMeal(id);
        kioskService.saveMealsToCSV();
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Meal with ID " + id + " deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Meal not found"));
        }
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