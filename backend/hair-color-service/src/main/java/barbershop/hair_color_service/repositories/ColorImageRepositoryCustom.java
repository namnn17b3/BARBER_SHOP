package barbershop.hair_color_service.repositories;

import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.entities.ColorImage;

import java.util.List;

public interface ColorImageRepositoryCustom {
    List<ColorImage> findByColor(PaginationRequest paginationRequest);
    int countByColor(PaginationRequest paginationRequest);
}
