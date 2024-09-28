package barbershop.order_service.repositories;

import barbershop.order_service.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>, OrderRepositoryCustom {
//    Cach 1: Indexed Query Parameters
//    @Query("select order from Order order where order.userId = ?1")
//    List<Order> findAllByUserId(Integer userId);

//    Cach 2: Named Parameters
    @Query("select order from Order order where order.userId = :userId")
    List<Order> findAllByUserId(@Param("userId") Integer userId);
}
