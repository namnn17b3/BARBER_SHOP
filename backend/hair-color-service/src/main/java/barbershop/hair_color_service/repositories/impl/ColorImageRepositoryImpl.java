package barbershop.hair_color_service.repositories.impl;

import barbershop.hair_color_service.dtos.request.PaginationRequest;
import barbershop.hair_color_service.entities.ColorImage;
import barbershop.hair_color_service.repositories.ColorImageRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

public class ColorImageRepositoryImpl implements ColorImageRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ColorImage> findByColor(PaginationRequest paginationRequest) {
        StringBuilder sql = new StringBuilder("SELECT c FROM ColorImage c inner join c.hairColor h where h.active = true");

        if (paginationRequest.getColor() != null) {
            sql.append(" and color = :color");
        }

        int page = Integer.parseInt(paginationRequest.getPage());
        int items = Integer.parseInt(paginationRequest.getItems());

        Query query = entityManager.createQuery(sql.toString(), ColorImage.class);

        if (paginationRequest.getColor() != null) {
            query.setParameter("color", paginationRequest.getColor());
        }

        if (paginationRequest.getWithPagination().equals("true")) {
            query.setMaxResults(items);
            query.setFirstResult((page - 1) * items);
        }

        return query.getResultList();
    }

    @Override
    public int countByColor(PaginationRequest paginationRequest) {
        StringBuilder sql = new StringBuilder("SELECT count(*) as totalRecords FROM color_image c inner join hair_color h " +
                "on c.hair_color_id = h.id " +
                "where h.active = true");
        if (paginationRequest.getColor() != null) {
            sql.append(" and color = :color");
        }
        Query query = entityManager.createNativeQuery(sql.toString());
        query.setParameter("color", paginationRequest.getColor());

        return Integer.parseInt(query.getResultList().get(0).toString());
    }
}
