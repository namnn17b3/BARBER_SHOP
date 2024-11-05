package barbershop.user_service.services;

import barbershop.user_service.dtos.response.UserDetailResponse;
import barbershop.user_service.exception.HttpException;
import barbershop.user_service.repositories.UserRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import user.*;

import java.util.List;

@GrpcService
public class UserGrpcService extends UserServiceGrpc.UserServiceImplBase {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationService authenticationService;

    public void getListUserFeedbackByIds(GetListUserFeedbackByIdsRequest request,
                                 StreamObserver<GetListUserFeedbackByIdsResponse> responseObserver) {
        List<barbershop.user_service.entities.User> users = userRepository.findAllById(request.getIdsList());
        GetListUserFeedbackByIdsResponse.Builder responsebuilder = GetListUserFeedbackByIdsResponse.newBuilder();
        for (barbershop.user_service.entities.User user : users) {
            UserFeedback userFeedback = UserFeedback.newBuilder()
                        .setId(user.getId())
                        .setUsername(user.getUsername())
                        .setAvatar(user.getAvatar() == null ? "" : user.getAvatar())
                    .build();
            responsebuilder.addUserFeedbacks(userFeedback);
        }

        responseObserver.onNext(responsebuilder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void checkAuthen(CheckAuthenRequest request,
                            StreamObserver<user.CheckAuthenResponse> responseObserver) {
        try {
            UserDetailResponse userDetailResponse = (UserDetailResponse) authenticationService.me(request.getToken()).getData();
            user.User userGrpc = user.User.newBuilder()
                        .setId(userDetailResponse.getId())
                        .setUsername(userDetailResponse.getUsername())
                        .setAvatar(userDetailResponse.getAvatar() == null ? "" : userDetailResponse.getAvatar())
                        .setEmail(userDetailResponse.getEmail())
                        .setPhone(userDetailResponse.getPhone())
                        .setAddress(userDetailResponse.getAddress())
                        .setGender(userDetailResponse.getGender().name())
                        .setRole(userDetailResponse.getRole().name())
                    .build();
            CheckAuthenResponse checkAuthenResponse = CheckAuthenResponse.newBuilder()
                        .setUser(userGrpc)
                    .build();
            responseObserver.onNext(checkAuthenResponse);
            responseObserver.onCompleted();
        } catch (HttpException httpException) {
            httpException.printStackTrace();
            if (httpException.getStatus() == 401) {
                responseObserver.onError(Status.UNAUTHENTICATED.withDescription(httpException.getMessage()).asException());
            } else {
                responseObserver.onError(Status.INTERNAL.withDescription(httpException.getMessage()).asException());
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            responseObserver.onError(Status.INTERNAL.withDescription(exception.getMessage()).asException());
        }
    }
}
