package barbershop.order_service.controllers;

import barbershop.order_service.dtos.request.FindOrderInfoRequest;
import barbershop.order_service.dtos.request.GetListOrderByUserRequest;
import barbershop.order_service.dtos.request.PaymentRequest;
import barbershop.order_service.dtos.request.StatisticQuantityRequest;
import barbershop.order_service.dtos.request.admin.GetListOrderForAdminRequest;
import barbershop.order_service.dtos.response.BaseResponse;
import barbershop.order_service.dtos.response.PaginationResponse;
import barbershop.order_service.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Validated // Bắt buộc để kích hoạt tính năng validate trên method parameter
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

    @GetMapping("/schedule-recently")
    public ResponseEntity<BaseResponse> getScheduleRecently(
            HttpServletRequest request) throws Exception {
        return new ResponseEntity<>(
                orderService.getScheduleRecently((Map<String, Object>) request.getAttribute("user")),
                HttpStatus.OK
        );
    }

    @PutMapping("/cancel-order/{orderId}")
    public ResponseEntity<BaseResponse> cancelOrder(
            @PathVariable(value = "orderId", required = true) String orderId,
            @RequestBody Map<String, Object> body) throws Exception {
        return new ResponseEntity<>(
                orderService.cancelOrder(orderId, (Map<String, Object>) body.get("user")),
                HttpStatus.OK
        );
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

    @GetMapping("/{orderId}")
    public ResponseEntity<BaseResponse> getOrderById(
            @PathVariable(value = "orderId", required = true) String orderId,
            HttpServletRequest request) throws Exception {
        Map<String, Object> user = (Map<String, Object>) request.getAttribute("user");
        return new ResponseEntity<>(orderService.getOrderById(orderId, user), HttpStatus.OK);
    }

    @GetMapping("/admin/statistic-quantity")
    public ResponseEntity<BaseResponse> getStatisticQuantity(
            @Valid @ModelAttribute StatisticQuantityRequest statisticQuantityRequest) throws Exception {
        return new ResponseEntity<>(orderService.getStatisticQuantity(statisticQuantityRequest), HttpStatus.OK);
    }

    @GetMapping("/admin/order-and-payment")
    public ResponseEntity<BaseResponse> getListOrderForAdmin(
            @Valid @ModelAttribute GetListOrderForAdminRequest getListOrderForAdminRequest,
            HttpServletRequest request) throws Exception {
        getListOrderForAdminRequest.setUser((Map<String, Object>) request.getAttribute("user"));
        return new ResponseEntity<>(orderService.getListOrderForAdmin(getListOrderForAdminRequest), HttpStatus.OK);
    }

    @PutMapping("/admin/mark-cutted/{orderId}")
    public ResponseEntity<BaseResponse> markCutted(@PathVariable(value="orderId") String orderId) throws Exception {
        return new ResponseEntity<>(orderService.makeCutted(orderId), HttpStatus.OK);
    }
}
