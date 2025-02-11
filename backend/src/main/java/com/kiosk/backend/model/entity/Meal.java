package com.kiosk.backend.model.entity;

import com.kiosk.backend.model.enums.MealCategories;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public class Meal {
    private int id;

    @NotNull(message = "Name cannot be null")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotNull(message = "Category cannot be null")
    private MealCategories category;

    @NotNull(message = "Price cannot be null")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "Price must be a valid number with up to two decimal places")
    private String price;

    @NotNull(message = "Ingredients cannot be null")
    @Size(min = 1, message = "There must be at least one ingredient")
    private List<Ingredient> ingredients;

    public Meal(int id, String name, MealCategories category, String price, List<Ingredient> ingredients) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.ingredients = ingredients;
    }

    public Meal() {}

    @Override
    public String toString() {
        return id + ". " + name + ", " + category + ", " + price;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public MealCategories getCategory() { return category; }
    public void setCategory(MealCategories category) { this.category = category; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public List<Ingredient> getIngredients() { return ingredients; }
    public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }
}

