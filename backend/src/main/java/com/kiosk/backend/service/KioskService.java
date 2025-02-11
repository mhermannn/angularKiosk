package com.kiosk.backend.service;

import com.kiosk.backend.model.*;
import com.kiosk.backend.model.entity.Ingredient;
import com.kiosk.backend.model.entity.Meal;
import com.kiosk.backend.model.entity.Order;
import com.kiosk.backend.model.enums.MealCategories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class KioskService {
    private final IngredientModel ingredientModel = new IngredientModel();
    private final MealModel mealModel;
    private final UserModel userModel;
    private final OrderService orderService;
    @Autowired
    public KioskService(UserModel userModel, OrderService orderService, List<Ingredient> ingredients) {
        this.userModel = userModel;
        this.orderService = orderService;
        ingredients.forEach(ingredientModel::addIngredient);
        this.mealModel = new MealModel(ingredientModel);
    }

    public UserModel getUserModel() {
        return userModel;
    }


    public MealModel getMealModel() {
        return mealModel;
    }

    public IngredientModel getIngredientModel() {
        return ingredientModel;
    }

    public void loadMealsFromCSV(String filePath) {
        String line;
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            br.readLine();
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                int id = Integer.parseInt(data[0]);
                String name = data[1];
                MealCategories category = MealCategories.valueOf(data[2]);
                String price = data[3];
                String[] ingredientNames = data[4].replaceAll("\"", "").split(",");
                List<Ingredient> ingredients = new ArrayList<>();
                for (String ingredientName : ingredientNames) {
                    Ingredient ingredient = ingredientModel.getIngredientByName(ingredientName.trim());
                    if (ingredient != null) {
                        ingredients.add(ingredient);
                    }
                }
                Meal meal = new Meal(id, name, category, price, ingredients);
                mealModel.addMeal(meal);
            }
        } catch (IOException | IllegalArgumentException e) {
            e.printStackTrace();
        }
    }

    public Map<String, Map<String, Map<String, Long>>> getOrderStatistics() {
        List<Order> orders = orderService.getAllOrders();
        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        List<Order> todaysOrders = orders.stream()
                .filter(order -> order.getCreatedAt().isAfter(startOfToday))
                .toList();

        List<Order> monthlyOrders = orders.stream()
                .filter(order -> order.getCreatedAt().isAfter(startOfMonth))
                .toList();

        return Map.of(
                "today", computeStats(todaysOrders),
                "month", computeStats(monthlyOrders)
        );
    }

    private Map<String, Map<String, Long>> computeStats(List<Order> orders) {
        Map<String, Long> paymentTypes = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderPaymentType().name(), Collectors.counting()));

        Map<String, Long> statuses = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderStatus().name(), Collectors.counting()));

        Map<String, Long> orderTypes = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderType().name(), Collectors.counting()));

        Map<String, Map<String, Long>> stats = new HashMap<>();
        stats.put("paymentTypes", paymentTypes);
        stats.put("statuses", statuses);
        stats.put("orderTypes", orderTypes);

        return stats;
    }

    public void saveMealsToCSV() {
        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter("src/main/resources/MEALS.csv")))) {
            writer.println("id,name,category,price,ingredients");
            for (Meal meal : mealModel.getAllMeals()) {
                String ingredients = meal.getIngredients().stream()
                        .map(Ingredient::getName)
                        .collect(Collectors.joining(","));
                writer.printf("%d,%s,%s,%s,\"%s\"%n",
                        meal.getId(),
                        meal.getName(),
                        meal.getCategory(),
                        meal.getPrice(),
                        ingredients);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
