package barbershop.order_service.dtos.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class IsIntValidator implements ConstraintValidator<IsInt, String> {
    @Override
    public void initialize(IsInt isInt) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        try {
            Integer.parseInt(value);
        } catch (Exception exception) {
            return false;
        }
        return true;
    }
}
