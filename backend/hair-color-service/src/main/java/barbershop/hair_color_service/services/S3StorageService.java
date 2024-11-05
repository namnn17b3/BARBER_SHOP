package barbershop.hair_color_service.services;

import org.springframework.web.multipart.MultipartFile;

public interface S3StorageService {
    String uploadFile(MultipartFile file);
    byte[] downloadFile(String fileName);
    String deleteFile(String fileName);
}
