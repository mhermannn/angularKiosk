package com.kiosk.backend;

import com.kiosk.backend.service.KioskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource("classpath:beans.xml")
public class BackendApplication implements CommandLineRunner {
    @Autowired
    private KioskService kioskService;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\nPosiłki z pliku CSV:");
        kioskService.loadMealsFromCSV("src/main/resources/MEALS.csv");
        kioskService.getMealModel().getAllMeals().forEach(System.out::println);
    }
}
