package barbershop.user_service.repositories.impl;

import barbershop.user_service.entities.User;
import barbershop.user_service.repositories.UserRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

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
}
