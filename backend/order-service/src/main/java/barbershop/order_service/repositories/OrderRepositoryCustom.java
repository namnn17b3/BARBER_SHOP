package barbershop.order_service.repositories;

import order.HairStyle;

import java.util.List;

public interface OrderRepositoryCustom {
    List<HairStyle> getHairStyles(List<Integer> hairStyleIds);
//    List<Order> getOrderByIds(List<Integer> orderIds);
}
