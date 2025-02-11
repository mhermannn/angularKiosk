package com.kiosk.backend.config;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;

public class EnumValidator implements ConstraintValidator<EnumConstraint, Object> {
    private Class<? extends Enum<?>> enumClass;

    @Override
    public void initialize(EnumConstraint constraintAnnotation) {
        this.enumClass = constraintAnnotation.enumClass();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        if (value instanceof String) {
            return Arrays.stream(enumClass.getEnumConstants())
                    .anyMatch(enumConstant -> enumConstant.name().equals(value));
        }
        if (value.getClass().isEnum()) {
            return enumClass.isInstance(value);
        }
        return false;
    }
}

