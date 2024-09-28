package barbershop.order_service.repositories.impl;

import barbershop.order_service.repositories.OrderRepositoryCustom;
import order.HairStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Component
public class OrderRepositoryImpl implements OrderRepositoryCustom {
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

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
}
