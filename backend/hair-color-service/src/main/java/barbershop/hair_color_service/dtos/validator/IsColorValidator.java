package barbershop.hair_color_service.dtos.validator;

import barbershop.hair_color_service.enums.Color;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class IsColorValidator implements ConstraintValidator<IsColor, String>  {
    private String[] colors;

    @Override
    public void initialize(IsColor constraintAnnotation) {
        List<String> ls = new ArrayList<>();
        for (Color c : Color.values()) {
            ls.add(c.name());
        }
        colors = ls.toArray(new String[ls.size()]);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return Arrays.stream(colors).toList().contains(value);
    }
}
