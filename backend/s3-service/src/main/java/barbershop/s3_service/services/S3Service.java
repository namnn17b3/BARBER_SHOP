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
import java.util.ArrayList;
import java.util.List;
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

    private String uploadFileUtil(UploadFileRequest request) {
        byte[] imageData = request.getData().toByteArray();
        String originalFileName = request.getOriginalFileName();
        String folderName = request.getFolderName();

        File fileObj = new File(originalFileName);
        try (FileOutputStream fos = new FileOutputStream(fileObj)) {
            fos.write(imageData);
        } catch (Exception e) {
            log.error("Error converting multipartFile to file", e);
        }

        String key = folderName+"/"+UUID.randomUUID()+"."+ Utils.getExtendFile(originalFileName);
        s3Client.putObject(new PutObjectRequest(bucketName, key, fileObj));
        fileObj.delete();

        return baseUrl + key;
    }

    private String deleteFileUtil(DeleteFileRequest request) {
        if (request.getUrl() == null || request.getUrl().isEmpty()) {
            return "";
        }
        String url = request.getUrl();
        String key = url.substring(url.lastIndexOf(baseUrl) + baseUrl.length());
        s3Client.deleteObject(bucketName, key);

        return baseUrl + key + " removed ...";
    }

    @Override
    public void uploadFile(UploadFileRequest request, StreamObserver<UploadFileResponse> responseObserver) {
//        byte[] imageData = request.getData().toByteArray();
//        String originalFileName = request.getOriginalFileName();
//        String folderName = request.getFolderName();
//
//        File fileObj = new File(originalFileName);
//        try (FileOutputStream fos = new FileOutputStream(fileObj)) {
//            fos.write(imageData);
//        } catch (Exception e) {
//            log.error("Error converting multipartFile to file", e);
//        }
//
//        String fileName = folderName+"/"+UUID.randomUUID()+"."+ Utils.getExtendFile(originalFileName);
//        s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
//        fileObj.delete();

        String url = uploadFileUtil(request);
        UploadFileResponse response = UploadFileResponse.newBuilder()
                 .setUrl(url)
                 .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void deleteFile(DeleteFileRequest request, StreamObserver<DeleteFileResponse> responseObserver) {
//        String url = request.getUrl();
//        String key = url.substring(url.lastIndexOf(baseUrl) + baseUrl.length());
//        s3Client.deleteObject(bucketName, key);

        String message = deleteFileUtil(request);
        DeleteFileResponse response = DeleteFileResponse.newBuilder()
                .setMessage(message)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void uploadFiles(UploadFilesRequest request, StreamObserver<UploadFilesResponse> responseObserver) {
        List<FileRequest> listFileRequest = request.getFileRequestList();
        List<UploadFilesResult> listUploadFilesResult = new ArrayList<>();
        for (FileRequest fileRequest : listFileRequest) {
            UploadFileRequest uploadFileRequest = UploadFileRequest.newBuilder()
                    .setData(fileRequest.getData())
                    .setOriginalFileName(fileRequest.getOriginalFileName())
                    .setFolderName(fileRequest.getFolderName())
                    .build();
            String url = uploadFileUtil(uploadFileRequest);
            listUploadFilesResult.add(UploadFilesResult.newBuilder()
                            .setIndex(fileRequest.getIndex())
                            .setUrl(url)
                    .build());
        }

        UploadFilesResponse uploadFilesResponse = UploadFilesResponse.newBuilder()
                .addAllResults(listUploadFilesResult)
                .build();

        responseObserver.onNext(uploadFilesResponse);
        responseObserver.onCompleted();
    }

    @Override
    public void deleteFiles(DeleteFilesRequest request, StreamObserver<DeleteFilesResponse> responseObserver) {
        List<DeleteFileInfo> listDeleteFileInfo = request.getDeleteFileInfosList();
        List<DeleteFilesResult> listDeleteFilesResult = new ArrayList<>();
        for (DeleteFileInfo deleteFileInfo : listDeleteFileInfo) {
            DeleteFileRequest deleteFileRequest = DeleteFileRequest.newBuilder()
                    .setUrl(deleteFileInfo.getUrl())
                    .build();
            String message = deleteFileUtil(deleteFileRequest);
            listDeleteFilesResult.add(DeleteFilesResult.newBuilder()
                            .setIndex(deleteFileInfo.getIndex())
                            .setMessage(message)
                    .build());
        }

        DeleteFilesResponse deleteFilesResponse = DeleteFilesResponse.newBuilder()
                .addAllResults(listDeleteFilesResult)
                .build();

        responseObserver.onNext(deleteFilesResponse);
        responseObserver.onCompleted();
    }
}
