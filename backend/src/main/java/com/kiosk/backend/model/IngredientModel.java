package com.kiosk.backend.model;

import com.kiosk.backend.model.entity.Ingredient;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
@Component
public class IngredientModel {
    private final List<Ingredient> ingredients = new ArrayList<>();

    public Ingredient addIngredient(Ingredient ingredient) {
        ingredients.add(ingredient);
        return ingredient;
    }

    public Ingredient getIngredientByName(String name) {
        return ingredients.stream()
                .filter(ingredient -> ingredient.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }

    public Ingredient getIngredientById(int id) {
        return ingredients.stream()
                .filter(ingredient -> ingredient.getId() == id)
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Ingredient not found with ID: " + id));
    }

    public List<Ingredient> getAllIngredients() {
        return new ArrayList<>(ingredients);
    }

    public Ingredient updateIngredient(int id, Ingredient updatedIngredient) {
        Ingredient existingIngredient = getIngredientById(id);
        existingIngredient.setName(updatedIngredient.getName());
        return existingIngredient;
    }

    public boolean deleteIngredient(int id) {
        return ingredients.removeIf(ingredient -> ingredient.getId() == id);
    }
}
