package barbershop.hair_color_service.dtos.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy=IsColorValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface IsColor {
    String message() default "Invalid color input";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

