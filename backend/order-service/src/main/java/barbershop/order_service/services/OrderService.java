package barbershop.order_service.services;

import barbershop.order_service.dtos.request.FindOrderInfoRequest;
import barbershop.order_service.dtos.request.GetListOrderByUserRequest;
import barbershop.order_service.dtos.request.PaymentRequest;
import barbershop.order_service.dtos.response.BaseResponse;
import barbershop.order_service.dtos.response.PaginationResponse;

public interface OrderService {
    BaseResponse findOrderInfo(FindOrderInfoRequest findOrderInfoRequest) throws Exception;
    BaseResponse payment(PaymentRequest paymentRequest) throws Exception;
    PaginationResponse getListOrderByUser(GetListOrderByUserRequest getListOrderByUserRequest) throws Exception;
}