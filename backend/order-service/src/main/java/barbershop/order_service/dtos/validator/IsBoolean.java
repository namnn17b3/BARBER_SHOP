package barbershop.order_service.dtos.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy=IsBooleanValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface IsBoolean {
    String message() default "Invalid boolean value";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
