package barbershop.user_service.dtos.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy=IsIntValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface IsInt {
    String message() default "Invalid integer format";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
