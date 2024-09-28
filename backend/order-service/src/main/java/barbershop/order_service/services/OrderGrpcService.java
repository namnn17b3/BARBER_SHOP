package barbershop.order_service.services;

import barbershop.order_service.repositories.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import order.*;
import org.springframework.beans.factory.annotation.Autowired;
import user.GetListUserFeedbackByIdsRequest;
import user.GetListUserFeedbackByIdsResponse;

import java.util.List;
import java.util.Map;

@GrpcService
public class OrderGrpcService extends OrderServiceGrpc.OrderServiceImplBase {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserClientGrpcService userClientGrpcService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void getListHairStyle(GetListHairStyleRequest request,
                                 StreamObserver<GetListHairStyleResponse> responseObserver) {

        List<HairStyle> hairStyles = orderRepository.getHairStyles(request.getIdsList());
        GetListHairStyleResponse.Builder builder = GetListHairStyleResponse.newBuilder();
        for (int i = 0; i < hairStyles.size(); i++) {
            HairStyle hairStyle = hairStyles.get(i);
            builder.addHairStyles(i, hairStyle);
        }
        GetListHairStyleResponse getListHairStyleResponse = builder.build();
        responseObserver.onNext(getListHairStyleResponse);
        responseObserver.onCompleted();
    }

    @Override
    public void getListUserFeedbackByOrderIds(GetListUserFeedbackByOrderIdsRequest request,
                                    StreamObserver<GetListUserFeedbackByOrderIdsResponse> responseObserver) {
        try {
            List<barbershop.order_service.entities.Order> orders = orderRepository.findAllById(request.getOrderIdsList());

            GetListUserFeedbackByIdsRequest.Builder getListUserFeedbackByIdsRequestBuilder = GetListUserFeedbackByIdsRequest.newBuilder();
            for (barbershop.order_service.entities.Order order : orders) {
                getListUserFeedbackByIdsRequestBuilder.addIds(order.getUserId());
            }
            GetListUserFeedbackByIdsRequest getListUserFeedbackByIdsRequest = getListUserFeedbackByIdsRequestBuilder.build();
            GetListUserFeedbackByIdsResponse getListUsersByIdsResponse = userClientGrpcService.getListUserFeedbackByIds(getListUserFeedbackByIdsRequest);

            GetListUserFeedbackByOrderIdsResponse.Builder getListUserFeedbackByOrderIdsResponseBuilder = GetListUserFeedbackByOrderIdsResponse.newBuilder();
            System.out.println(orders.size());
            for (int i = 0; i < orders.size(); i++) {
                barbershop.order_service.entities.Order orderEntity = orders.get(i);
                Map<String, Object> hairColorMap = (Map<String, Object>) objectMapper.readValue(orderEntity.getHairColor() == null ? "null" : orderEntity.getHairColor(), Map.class);
                user.UserFeedback user = getUserById(getListUsersByIdsResponse.getUserFeedbacksList(), orderEntity.getUserId());
                order.UserFeedback userFeedback = order.UserFeedback.newBuilder()
                        .setId(user.getId())
                        .setAvatar(user.getAvatar())
                        .setUsername(user.getUsername())
                        .setHairColor(hairColorMap == null ? "" : hairColorMap.get("color").toString())
                        .setOrderId(orderEntity.getId())
                        .build();
                getListUserFeedbackByOrderIdsResponseBuilder.addUserFeedbacks(i, userFeedback);
            }
            GetListUserFeedbackByOrderIdsResponse getListUserFeedbackByOrderIdsResponse = getListUserFeedbackByOrderIdsResponseBuilder.build();

            responseObserver.onNext(getListUserFeedbackByOrderIdsResponse);
            responseObserver.onCompleted();
        } catch (Exception exception) {
            responseObserver.onError(Status.INTERNAL.withDescription(exception.getMessage()).asRuntimeException());
        }
    }

    @Override
    public void getListOrderByUserId(GetListOrderIdByUserIdRequest request,
                                     StreamObserver<GetListOrderIdByUserIdResponse> responseObserver) {
        try {
            List<barbershop.order_service.entities.Order> orders = orderRepository.findAllByUserId(request.getUserId());
            GetListOrderIdByUserIdResponse.Builder getListOrderIdByUserIdResponseBuilder = GetListOrderIdByUserIdResponse.newBuilder();
            for (int i = 0; i < orders.size(); i++) {
                barbershop.order_service.entities.Order order = orders.get(i);
                getListOrderIdByUserIdResponseBuilder.addOrderIds(order.getId());
            }

            responseObserver.onNext(getListOrderIdByUserIdResponseBuilder.build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            e.printStackTrace();
            responseObserver.onError(Status.INTERNAL.withDescription(e.getMessage()).asRuntimeException());
        }
    }

    private user.UserFeedback getUserById(List<user.UserFeedback> users, int userId) {
        for (user.UserFeedback u: users) {
            if (u.getId() == userId) return u;
        }
        return null;
    }
}
