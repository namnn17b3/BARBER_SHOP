package barbershop.block_time_service.dtos.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class IsBooleanValidator implements ConstraintValidator<IsBoolean, String> {
    @Override
    public void initialize(IsBoolean isBoolean) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value.equals("true") || value.equals("false")) {
            return true;
        }
        return false;
    }
}
