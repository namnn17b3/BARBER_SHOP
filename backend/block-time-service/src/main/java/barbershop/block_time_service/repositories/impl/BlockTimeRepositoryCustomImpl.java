package barbershop.block_time_service.repositories.impl;


import barbershop.block_time_service.dtos.request.GetAllBlockTimesRequest;
import barbershop.block_time_service.entities.BlockTime;
import barbershop.block_time_service.repositories.BlockTimeRepositoryCustom;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Component
public class BlockTimeRepositoryCustomImpl implements BlockTimeRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<BlockTime> getAllBlockTime(GetAllBlockTimesRequest getAllBlockTimesRequest) {
        String sql = "select * from block_times\n";

        if (getAllBlockTimesRequest.getRange() != null && !getAllBlockTimesRequest.getRange().isEmpty()) {
            sql += "where date(:startDate) <= date(block_times.date) and date(block_times.date) <= date(:endDate)\n";
        }

        sql += "order by date(block_times.date) ";

        if (getAllBlockTimesRequest.getSortBy() != null) {
            sql += getAllBlockTimesRequest.getSortBy();
        } else {
            sql += "desc";
        }

        sql += "\nlimit :offset, :limit";

        int page = Integer.parseInt(getAllBlockTimesRequest.getPage());
        int items = Integer.parseInt(getAllBlockTimesRequest.getItems());

        Query query = entityManager.createNativeQuery(sql, BlockTime.class);

        if (getAllBlockTimesRequest.getRange() != null && !getAllBlockTimesRequest.getRange().isEmpty()) {
            String startDate = getAllBlockTimesRequest.getRange().split(",")[0].trim();
            String endDate = getAllBlockTimesRequest.getRange().split(",")[1].trim();
            query.setParameter("startDate", startDate);
            query.setParameter("endDate", endDate);
        }
        query.setParameter("offset", (page - 1) * items);
        query.setParameter("limit", items);

        return query.getResultList();
    }

    @Override
    public int countAllBlockTime(GetAllBlockTimesRequest getAllBlockTimesRequest) {
        String sql = "select count(*) from block_times\n";

        if (getAllBlockTimesRequest.getRange() != null && !getAllBlockTimesRequest.getRange().isEmpty()) {
            sql += "where date(:startDate) <= date(block_times.date) and date(block_times.date) <= date(:endDate)\n";
        }

        Query query = entityManager.createNativeQuery(sql);

        if (getAllBlockTimesRequest.getRange() != null && !getAllBlockTimesRequest.getRange().isEmpty()) {
            String startDate = getAllBlockTimesRequest.getRange().split(",")[0].trim();
            String endDate = getAllBlockTimesRequest.getRange().split(",")[1].trim();
            query.setParameter("startDate", startDate);
            query.setParameter("endDate", endDate);
        }

        return Integer.parseInt(query.getResultList().get(0).toString());
    }
}
