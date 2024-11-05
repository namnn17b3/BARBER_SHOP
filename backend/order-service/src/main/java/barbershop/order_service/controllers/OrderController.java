package barbershop.order_service.controllers;

import barbershop.order_service.dtos.request.FindOrderInfoRequest;
import barbershop.order_service.dtos.request.GetListOrderByUserRequest;
import barbershop.order_service.dtos.request.PaymentRequest;
import barbershop.order_service.dtos.response.BaseResponse;
import barbershop.order_service.dtos.response.PaginationResponse;
import barbershop.order_service.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/find-order-info")
    public ResponseEntity<BaseResponse> findOrderInfo(
            @ModelAttribute FindOrderInfoRequest findOrderInfoRequest,
            HttpServletRequest request) throws Exception {
        
        findOrderInfoRequest.setUser((Map<String, Object>) request.getAttribute("user"));
        return new ResponseEntity<>(orderService.findOrderInfo(findOrderInfoRequest), HttpStatus.OK);
    }

    @PostMapping("/payment")
    public ResponseEntity<BaseResponse> payment(@RequestBody PaymentRequest paymentRequest) throws Exception {
        return new ResponseEntity<>(orderService.payment(paymentRequest), HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<PaginationResponse> getListOrderByUser(
            @ModelAttribute GetListOrderByUserRequest getListOrderByUserRequest,
            HttpServletRequest request) throws Exception {
        getListOrderByUserRequest.setUser((Map<String, Object>) request.getAttribute("user"));
        return new ResponseEntity<>(orderService.getListOrderByUser(getListOrderByUserRequest), HttpStatus.OK);
    }
}
