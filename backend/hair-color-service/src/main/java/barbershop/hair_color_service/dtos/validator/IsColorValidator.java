package barbershop.hair_color_service.dtos.validator;

import barbershop.hair_color_service.entities.HairColor;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class IsColorValidator implements ConstraintValidator<IsColor, String>  {
    @PersistenceContext
    private EntityManager entityManager;

    private String[] colors;

    @Override
    public void initialize(IsColor constraintAnnotation) {
        List<HairColor> hairColors = entityManager.createNativeQuery("select * from hair_color", HairColor.class).getResultList();
        List<String> ls = new ArrayList<>();
        for (HairColor hairColor : hairColors) {
            ls.add(hairColor.getColor());
        }
        colors = ls.toArray(new String[ls.size()]);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return Arrays.stream(colors).toList().contains(value);
    }
}
