package barbershop.order_service.repositories;

import barbershop.order_service.dtos.request.GetListOrderByUserRequest;
import barbershop.order_service.entities.Order;
import order.HairStyle;

import java.util.List;

public interface OrderRepositoryCustom {
    List<HairStyle> getHairStyles(List<Integer> hairStyleIds);
    List<Integer> findBarberIds(List<Integer> barberIds);
    List<Order> getListOrderByUser(int id, GetListOrderByUserRequest getListOrderByUserRequest);
    int countOrderByUser(int id, GetListOrderByUserRequest getListOrderByUserRequest);
}
