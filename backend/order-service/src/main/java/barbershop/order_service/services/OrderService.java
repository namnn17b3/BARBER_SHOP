package barbershop.order_service.services;

import barbershop.order_service.dtos.request.FindOrderInfoRequest;
import barbershop.order_service.dtos.request.GetListOrderByUserRequest;
import barbershop.order_service.dtos.request.PaymentRequest;
import barbershop.order_service.dtos.request.StatisticQuantityRequest;
import barbershop.order_service.dtos.request.admin.GetListOrderForAdminRequest;
import barbershop.order_service.dtos.response.BaseResponse;
import barbershop.order_service.dtos.response.PaginationResponse;

import java.util.Map;

public interface OrderService {
    BaseResponse findOrderInfo(FindOrderInfoRequest findOrderInfoRequest) throws Exception;
    BaseResponse payment(PaymentRequest paymentRequest) throws Exception;
    PaginationResponse getListOrderByUser(GetListOrderByUserRequest getListOrderByUserRequest) throws Exception;
    BaseResponse getOrderById(String orderIdString, Map<String, Object> user) throws Exception;
    BaseResponse getStatisticQuantity(StatisticQuantityRequest statisticQuantityRequest) throws Exception;
    BaseResponse getListOrderForAdmin(GetListOrderForAdminRequest getListOrderForAdminRequest) throws Exception;
    BaseResponse makeCutted(String orderId) throws Exception;
    BaseResponse getScheduleRecently(Map<String, Object> user) throws Exception;
    BaseResponse cancelOrder(String orderId, Map<String, Object> user) throws Exception;
}
