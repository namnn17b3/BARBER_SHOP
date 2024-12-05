package barbershop.s3_service.utils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Utils {
    public static String getExtendFile(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ""; // Trả về chuỗi rỗng nếu không có phần mở rộng
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
