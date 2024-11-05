package barbershop.hair_color_service.services;

import barbershop.hair_color_service.repositories.HairColorRepository;
import hairColor.GetDetailHairColorRequest;
import hairColor.GetDetailHairColorResponse;
import hairColor.HairColor;
import hairColor.HairColorServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

@GrpcService
public class HairColorGrpcService extends HairColorServiceGrpc.HairColorServiceImplBase {
    @Autowired
    private HairColorRepository hairColorRepository;

    @Override
    public void getDetailHairColor(GetDetailHairColorRequest request,
                                   StreamObserver<GetDetailHairColorResponse> responseObserver) {
        barbershop.hair_color_service.entities.HairColor hairColor = hairColorRepository.findById(request.getId()).orElse(null);
        if (hairColor == null) {
            responseObserver.onError(io.grpc.Status.NOT_FOUND.asException());
            return;
        }

        HairColor hairColorGrpc = HairColor.newBuilder()
                .setId(hairColor.getId())
                .setColor(hairColor.getColor())
                .setActive(hairColor.isActive())
                .setColorCode(hairColor.getColorCode())
                .setPrice(hairColor.getPrice())
                .build();

        responseObserver.onNext(GetDetailHairColorResponse.newBuilder().setHairColor(hairColorGrpc).build());
        responseObserver.onCompleted();
    }
}
