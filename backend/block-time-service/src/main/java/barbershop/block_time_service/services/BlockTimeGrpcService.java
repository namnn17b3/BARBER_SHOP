package barbershop.block_time_service.services;

import barbershop.block_time_service.entities.BlockTime;
import barbershop.block_time_service.repositories.BlockTimeRepository;
import block_time.BlockTimeServiceGrpc;
import block_time.CheckBlockTimeRequest;
import block_time.CheckBlockTimeResponse;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

@Slf4j
@GrpcService
public class BlockTimeGrpcService extends BlockTimeServiceGrpc.BlockTimeServiceImplBase {
    @Autowired
    private BlockTimeRepository blockTimeRepository;
    @Override
    public void checkBlockTime(CheckBlockTimeRequest request,
                               StreamObserver<CheckBlockTimeResponse> responseObserver) {
        try {
            BlockTime blockTime = blockTimeRepository.findByDateAndTime(request.getDate(), request.getTime()).orElse(null);
            if (blockTime == null) {
                responseObserver.onNext(CheckBlockTimeResponse.newBuilder().setIsBlocked(false).build());
                responseObserver.onCompleted();
                return;
            }
            responseObserver.onNext(CheckBlockTimeResponse.newBuilder().setIsBlocked(true).build());
            responseObserver.onCompleted();
        } catch (Exception exception) {
            log.error("ERROR", exception);
            responseObserver.onError(io.grpc.Status.INTERNAL.withDescription(exception.getMessage()).asException());
        }
    }
}
