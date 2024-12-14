package barbershop.order_service.repositories.impl;

import barbershop.order_service.dtos.request.GetListOrderByUserRequest;
import barbershop.order_service.dtos.request.admin.GetListOrderForAdminRequest;
import barbershop.order_service.entities.Order;
import barbershop.order_service.repositories.OrderRepositoryCustom;
import order.HairStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.RowMapper;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Component
public class OrderRepositoryImpl implements OrderRepositoryCustom {
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<HairStyle> getHairStyles(List<Integer> hairStyleIds) {
        SqlParameterSource ids = new MapSqlParameterSource("ids", hairStyleIds);
        return namedParameterJdbcTemplate.query("select\n" +
                "    json_unquote(json_extract(hair_style, '$.id')) AS hair_style_id,\n" +
                "    count(json_unquote(json_extract(hair_style, '$.id'))) AS booking\n" +
                "from orders\n" +
                "where json_unquote(json_extract(hair_style, '$.id')) in (:ids)\n" +
                "group by hair_style_id\n" +
                "order by hair_style_id asc", ids, new RowMapper<HairStyle>() {

            @Override
            public HairStyle mapRow(ResultSet rs, int rowNum) throws SQLException {
                HairStyle hairStyle = HairStyle.newBuilder()
                        .setId(rs.getInt("hair_style_id"))
                        .setBooking(rs.getInt("booking"))
                        .build();
                return hairStyle;
            }
        });
    }

    @Override
    public List<Integer> findBarberIds(List<Integer> barberIds) {
        SqlParameterSource ids = new MapSqlParameterSource("ids", barberIds);
        return namedParameterJdbcTemplate.query("select sq1.barber_id from\n" +
                "(\n" +
                "\tselect json_unquote(json_extract(barber, '$.id')) as barber_id, count(json_unquote(json_extract(barber, '$.id'))) as counting\n" +
                "\tfrom orders\n" +
                "\twhere json_unquote(json_extract(barber, '$.id')) >= 1 and json_unquote(json_extract(barber, '$.id')) <= 20\n" +
                "\tand DATE(schedule) = '2024-08-02' and schedule != '2024-08-02 16:54:20' and json_unquote(json_extract(barber, '$.active')) = 'true'\n" +
                "\tgroup by json_unquote(json_extract(barber, '$.id'))\n" +
                ") as sq1\n" +
                "inner join\n" +
                "(\n" +
                "\tselect json_unquote(json_extract(barber, '$.id')) as barber_id, count(json_unquote(json_extract(barber, '$.id'))) as counting_all\n" +
                "\tfrom orders\n" +
                "\twhere json_unquote(json_extract(barber, '$.id')) in (:ids)\n" +
                "\tand DATE(schedule) = '2024-08-02'\n" +
                "\tgroup by json_unquote(json_extract(barber, '$.id'))\n" +
                ") as sq2\n" +
                "on sq1.barber_id = sq2.barber_id\n" +
                "where sq1.counting = sq2.counting_all\n" +
                "order by sq1.counting asc\n" +
                "limit 1", ids, new RowMapper<Integer>() {

            @Override
            public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
                return rs.getInt("barber_id");
            }
        });
    }

    @Override
    public List<Order> getListOrderByUser(int id, GetListOrderByUserRequest getListOrderByUserRequest) {
        StringBuilder sql = new StringBuilder("select *\n" +
                "from orders\n" +
                "where user_id = :userId\n");

        if (getListOrderByUserRequest.getCodeOrHairStyle() != null) {
            sql.append("and (id = :id or json_unquote(json_extract(hair_style, '$.name')) like :codeOrHairStyle)\n");
        }

        if (getListOrderByUserRequest.getSortBy() != null) {
            if (getListOrderByUserRequest.getSortBy().equals("desc")) {
                sql.append("order by order_time desc\n");
            } else {
                sql.append("order by order_time asc\n");
            }
        } else {
            sql.append("order by order_time desc\n");
        }


        if (getListOrderByUserRequest.getWithPagination().equals("true")) {
            sql.append("limit :offset, :limit\n");
        }

        Query query = entityManager.createNativeQuery(sql.toString(), Order.class);
        query.setParameter("userId", (int) getListOrderByUserRequest.getUser().get("id"));

        if (getListOrderByUserRequest.getCodeOrHairStyle() != null) {
            query.setParameter("id", id);
            query.setParameter("codeOrHairStyle", "%"+getListOrderByUserRequest.getCodeOrHairStyle()+"%");
        }

        if (getListOrderByUserRequest.getWithPagination().equals("true")) {
            int page = Integer.parseInt(getListOrderByUserRequest.getPage());
            int items = Integer.parseInt(getListOrderByUserRequest.getItems());
            query.setParameter("offset", (page - 1) * items);
            query.setParameter("limit", items);
        }

        return query.getResultList();
    }

    @Override
    public int countOrderByUser(int id, GetListOrderByUserRequest getListOrderByUserRequest) {
        StringBuilder sql = new StringBuilder("select count(*)\n" +
                "from orders\n" +
                "where user_id = :userId\n");

        if (getListOrderByUserRequest.getCodeOrHairStyle() != null) {
            sql.append("and (id = :id or json_unquote(json_extract(hair_style, '$.name')) like :codeOrHairStyle)\n");
        }

        Query query = entityManager.createNativeQuery(sql.toString());
        query.setParameter("userId", (int) getListOrderByUserRequest.getUser().get("id"));

        if (getListOrderByUserRequest.getCodeOrHairStyle() != null) {
            query.setParameter("id", id);
            query.setParameter("codeOrHairStyle", "%"+getListOrderByUserRequest.getCodeOrHairStyle()+"%");
        }

        if (query.getResultList().size() == 0) {
            return 0;
        }

        return Integer.parseInt(query.getResultList().get(0).toString());
    }

    @Override
    public int statisticQuantity(int month, int year) {
        String sql = "select count(*) as quantity\n" +
                "from orders\n" +
                "where extract(month from orders.order_time) = :month and extract(year from orders.order_time) = :year";
//        or
//        String sql = "select count(*) as quantity\n" +
//                "from orders\n" +
//                "where month(orders.order_time) = :month and year(orders.order_time) = :year";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("month", month);
        query.setParameter("year", year);

        if (query.getResultList().size() == 0) {
            return 0;
        }

        return Integer.parseInt(query.getResultList().get(0).toString());
    }

    @Override
    public List<Order> getListOrderForAdmin(GetListOrderForAdminRequest getListOrderForAdminRequest) {
        String startDate = getListOrderForAdminRequest.getRange().split(",")[0].trim();
        String endDate = getListOrderForAdminRequest.getRange().split(",")[1].trim();
        String sql = "select * from orders\n" +
                "where date(:startDate) <= date(order_time) and date(order_time) <= date(:endDate)\n" +
                "order by order_time ";
        if (getListOrderForAdminRequest.getSortBy() != null) {
            sql += getListOrderForAdminRequest.getSortBy();
        } else {
            sql += "desc";
        }
        Query query = entityManager.createNativeQuery(sql, Order.class);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);

        return query.getResultList();
    }

    @Override
    public String getScheduleRecently(int userId) {
        String sql = "select cast(orders.schedule as char) as schedule\n" +
                "from orders\n" +
                "where orders.user_id = :userId and DATE(NOW()) = DATE(orders.schedule) and NOW() <= orders.schedule\n" +
                "order by orders.schedule desc\n" +
                "limit 1";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("userId", userId);

        if (query.getResultList().size() == 0) {
            return null;
        }

        return query.getResultList().get(0).toString();
    }
}
