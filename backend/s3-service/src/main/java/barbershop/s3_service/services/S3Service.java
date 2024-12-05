package barbershop.s3_service.services;

import barbershop.s3_service.utils.Utils;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import s3.*;

import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

@Slf4j
@GrpcService
public class S3Service extends S3ServiceGrpc.S3ServiceImplBase {
    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${application.base-url}")
    private String baseUrl;

    @Autowired
    private AmazonS3 s3Client;

    @Override
    public void uploadFile(UploadFileRequest request, StreamObserver<UploadFileResponse> responseObserver) {
        byte[] imageData = request.getData().toByteArray();
        String originalFileName = request.getOriginalFileName();
        String folderName = request.getFolderName();

        File fileObj = new File(originalFileName);
        try (FileOutputStream fos = new FileOutputStream(fileObj)) {
            fos.write(imageData);
        } catch (Exception e) {
            log.error("Error converting multipartFile to file", e);
        }

        String fileName = folderName+"/"+UUID.randomUUID()+"."+ Utils.getExtendFile(originalFileName);
        s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
        fileObj.delete();
        UploadFileResponse response = UploadFileResponse.newBuilder()
                 .setUrl(baseUrl + fileName)
                 .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void deleteFile(DeleteFileRequest request, StreamObserver<DeleteFileResponse> responseObserver) {
        String url = request.getUrl();
        String key = url.substring(url.lastIndexOf(baseUrl) + baseUrl.length());
        s3Client.deleteObject(bucketName, key);
        DeleteFileResponse response = DeleteFileResponse.newBuilder()
                .setMessage(baseUrl + key + " removed ...")
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
