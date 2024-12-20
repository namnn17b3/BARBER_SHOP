package barbershop.user_service.services;

import org.springframework.web.multipart.MultipartFile;

public interface S3StorageService {
    String uploadFile(MultipartFile file) throws Exception;
    byte[] downloadFile(String fileName);
    String deleteFile(String fileName);
    String uploadFileGrpc(MultipartFile file) throws Exception;
    String deleteFileGrpc(String url);
}
