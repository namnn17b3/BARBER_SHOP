package barbershop.order_service.services.impl;

import barbershop.order_service.services.UserClientGrpcService;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;
import user.GetListUserFeedbackByIdsRequest;
import user.GetListUserFeedbackByIdsResponse;
import user.UserServiceGrpc;

@Service
public class UserClientGrpcServiceImpl implements UserClientGrpcService {
    @GrpcClient("user-grpc-server")
    private UserServiceGrpc.UserServiceBlockingStub userServiceBlockingStub;

    @Override
    public GetListUserFeedbackByIdsResponse getListUserFeedbackByIds(GetListUserFeedbackByIdsRequest request) {
        return userServiceBlockingStub.getListUserFeedbackByIds(request);
    }
}
