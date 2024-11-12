package barbershop.user_service.services.impl;

import barbershop.user_service.services.S3StorageService;
import barbershop.user_service.utils.Utils;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class S3StorageServiceImpl implements S3StorageService {
    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${application.folder-name}")
    private String folderName;

    @Value("${application.base-url}")
    private String baseUrl;

    @Autowired
    private AmazonS3 s3Client;

    @Override
    public String uploadFile(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            return null;
        }
        File fileObj = convertMultiPartFileToFile(file);
        String fileName = folderName+"/"+UUID.randomUUID()+"."+Utils.getExtendFile(file.getOriginalFilename());
        s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
        fileObj.delete();
        return baseUrl + fileName;
    }

    @Override
    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3Client.getObject(bucketName, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String deleteFile(String fileName) {
        s3Client.deleteObject(bucketName, fileName);
        return baseUrl + folderName + "/" + fileName + " removed ...";
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (Exception e) {
            log.error("Error converting multipartFile to file", e);
        }
        return convertedFile;
    }
}
