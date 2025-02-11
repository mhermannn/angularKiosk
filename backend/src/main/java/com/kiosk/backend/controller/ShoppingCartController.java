package com.kiosk.backend.controller;

import com.kiosk.backend.model.*;
import com.kiosk.backend.model.entity.Order;
import com.kiosk.backend.model.entity.User;
import com.kiosk.backend.model.enums.OrderPaymentType;
import com.kiosk.backend.model.enums.OrderStatus;
import com.kiosk.backend.service.KioskService;
import com.kiosk.backend.service.OrderService;
import com.kiosk.backend.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.util.ArrayList;

import static com.kiosk.backend.model.enums.OrderStatus.NEW;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;

    @Autowired
    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Order> addToCart(@RequestParam String mealName, @RequestBody Order order) {
        shoppingCartService.addToCart(order, mealName);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/remove")
    public ResponseEntity<Order> removeFromCart(@RequestParam String mealName, @RequestBody Order order) {
        shoppingCartService.removeFromCart(order, mealName);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/clear")
    public ResponseEntity<Order> clearCart(@RequestBody Order order) {
        shoppingCartService.clearCart(order);
        return ResponseEntity.ok(order);
    }
}