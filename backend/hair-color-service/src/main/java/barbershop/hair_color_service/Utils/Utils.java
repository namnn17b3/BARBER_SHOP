package barbershop.hair_color_service.Utils;

import barbershop.hair_color_service.exception.ImageFileTypeException;
import org.springframework.web.multipart.MultipartFile;

import java.text.Normalizer;

public class Utils {
    public static String capitalize(String s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    public static void checkImageFileType(MultipartFile multipartFile, String field, String resource) {
        String contentType = multipartFile.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/png") || contentType.equals("image/jpeg") || contentType.equals("image/jpg"))) {
            throw new ImageFileTypeException("Only PNG, JPG, and JPEG files are allowed", field, resource);
        }
    }

    public static String stripAccents(String s) {
        s = Normalizer.normalize(s, Normalizer.Form.NFD);
        s = s.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        return s;
    }
}
