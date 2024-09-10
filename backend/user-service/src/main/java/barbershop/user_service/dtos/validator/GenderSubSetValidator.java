package barbershop.user_service.dtos.validator;

import barbershop.user_service.enums.Gender;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;

public class GenderSubSetValidator implements ConstraintValidator<GenderSubset, String> {
    private Gender[] genders;

    @Override
    public void initialize(GenderSubset constraint) {
        this.genders = constraint.anyOf();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        try {
            if (value == null) return true;
            Gender gender = Gender.valueOf(value);
            return Arrays.asList(genders).contains(gender);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
