package barbershop.order_service.services;


import user.GetListUserFeedbackByIdsRequest;
import user.GetListUserFeedbackByIdsResponse;

public interface UserClientGrpcService {
    GetListUserFeedbackByIdsResponse getListUserFeedbackByIds(GetListUserFeedbackByIdsRequest request);
}
