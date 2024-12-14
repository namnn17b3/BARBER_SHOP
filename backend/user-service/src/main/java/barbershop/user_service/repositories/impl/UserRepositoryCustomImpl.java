package barbershop.user_service.repositories.impl;

import barbershop.user_service.dtos.request.GetListUserForAdminRequest;
import barbershop.user_service.entities.User;
import barbershop.user_service.enums.Gender;
import barbershop.user_service.enums.Role;
import barbershop.user_service.repositories.UserRepositoryCustom;
import barbershop.user_service.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void updateUserProfile(User user) {
        String sql = "UPDATE users SET\n" +
                "username = :username,\n" +
                "phone = :phone,\n" +
                "address = :address,\n" +
                "gender = :gender\n," +
                "avatar = :avatar\n" +
                "WHERE id = :id\n";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("username", user.getUsername());
        parameters.addValue("phone", user.getPhone());
        parameters.addValue("address", user.getAddress());
        parameters.addValue("gender", user.getGender().name());
        parameters.addValue("avatar", user.getAvatar());
        parameters.addValue("id", user.getId());

        namedParameterJdbcTemplate.update(sql, parameters);
    }

    @Override
    public int statisticQuantity(int month, int year) {
        String sql = "select count(*) as quantity\n" +
                "from users\n" +
                "where extract(month from users.created_at) = :month and extract(year from users.created_at) = :year";
//        or
//        String sql = "select count(*) as quantity\n" +
//                "from users\n" +
//                "where date_part('month', users.created_at) = :month and date_part('year', users.created_at) = :year";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("month", month);
        query.setParameter("year", year);

        if (query.getResultList().size() == 0) {
            return 0;
        }

        return Integer.parseInt(query.getResultList().get(0).toString());
    }

    @Override
    public List<User> getListUserByIdsAndKeyword(List<Integer> ids, String keyword) {
        String sql = "select * from users where id in (:ids)\n";
        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put("ids", ids);
        if (keyword != null && !keyword.isEmpty()) {
            sql += "and (username ilike :keyword or email ilike :keyword)";
            parameters.put("keyword", "%"+keyword+"%");
        }

        return namedParameterJdbcTemplate.query(sql, parameters, new RowMapper<User>() {

            @Override
            public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setAvatar(rs.getString("avatar"));
                user.setEmail(rs.getString("email"));
                user.setPhone(rs.getString("phone"));
                user.setAddress(rs.getString("address"));
                user.setGender(Gender.valueOf(rs.getString("gender")));
                user.setRole(Role.valueOf(rs.getString("role")));
                return user;
            }
        });
    }

    @Override
    public List<User> getListUserForAdmin(GetListUserForAdminRequest getListUserForAdminRequest) {
        String sql = "select * from users where users.role = 'USER'\n";
        if (getListUserForAdminRequest.getKeyword() != null && !getListUserForAdminRequest.getKeyword().isEmpty()) {
            sql += "and unaccent(users.username) ilike :keyword\n";
        }
        if (getListUserForAdminRequest.getGender() != null && !getListUserForAdminRequest.getGender().isEmpty()) {
            sql += "and users.gender = :gender\n";
        }
        if (getListUserForAdminRequest.getActive() != null && !getListUserForAdminRequest.getActive().isEmpty()) {
            sql += "and users.active = :active\n";
        }
        sql += "order by users.id asc\n";
        int page = Integer.parseInt(getListUserForAdminRequest.getPage());
        int items = Integer.parseInt(getListUserForAdminRequest.getItems());
        sql += "offset :x limit :len";

        Query query = entityManager.createNativeQuery(sql, User.class);

        if (getListUserForAdminRequest.getKeyword() != null && !getListUserForAdminRequest.getKeyword().isEmpty()) {
            query.setParameter("keyword", "%"+ Utils.stripAccents(getListUserForAdminRequest.getKeyword())+"%");
        }
        if (getListUserForAdminRequest.getGender() != null && !getListUserForAdminRequest.getGender().isEmpty()) {
            query.setParameter("gender", getListUserForAdminRequest.getGender());
        }
        if (getListUserForAdminRequest.getActive() != null && !getListUserForAdminRequest.getActive().isEmpty()) {
            if (getListUserForAdminRequest.getActive().equals("true")) {
                query.setParameter("active", true);
            } else if (getListUserForAdminRequest.getActive().equals("false")) {
                query.setParameter("active", false);
            }
        }

        query.setParameter("x", page - 1);
        query.setParameter("len", items);

        return query.getResultList();
    }

    @Override
    public int countUserForAdmin(GetListUserForAdminRequest getListUserForAdminRequest) {
        String sql = "select count(*) from users where users.role = 'USER'\n";
        if (getListUserForAdminRequest.getKeyword() != null && !getListUserForAdminRequest.getKeyword().isEmpty()) {
            sql += "and unaccent(users.username) ilike :keyword\n";
        }
        if (getListUserForAdminRequest.getGender() != null && !getListUserForAdminRequest.getGender().isEmpty()) {
            sql += "and users.gender = :gender\n";
        }
        if (getListUserForAdminRequest.getActive() != null && !getListUserForAdminRequest.getActive().isEmpty()) {
            sql += "and users.active = :active\n";
        }

        Query query = entityManager.createNativeQuery(sql);

        if (getListUserForAdminRequest.getKeyword() != null && !getListUserForAdminRequest.getKeyword().isEmpty()) {
            query.setParameter("keyword", "%"+ Utils.stripAccents(getListUserForAdminRequest.getKeyword())+"%");
        }
        if (getListUserForAdminRequest.getGender() != null && !getListUserForAdminRequest.getGender().isEmpty()) {
            query.setParameter("gender", getListUserForAdminRequest.getGender());
        }
        if (getListUserForAdminRequest.getActive() != null && !getListUserForAdminRequest.getActive().isEmpty()) {
            if (getListUserForAdminRequest.getActive().equals("true")) {
                query.setParameter("active", true);
            } else if (getListUserForAdminRequest.getActive().equals("false")) {
                query.setParameter("active", false);
            }
        }

        if (query.getResultList().size() == 0) {
            return 0;
        }

        return Integer.parseInt(query.getResultList().get(0).toString());
    }
}
