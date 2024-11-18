package barbershop.user_service.repositories.impl;

import barbershop.user_service.entities.User;
import barbershop.user_service.repositories.UserRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

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

        return Integer.parseInt(query.getResultList().get(0).toString());
    }
}
