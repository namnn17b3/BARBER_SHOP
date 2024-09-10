package barbershop.user_service.securities;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Hash {
    public static String hmacSha256(String key, String data) throws Exception {
        // Chuyển đổi khóa từ chuỗi sang mảng byte sử dụng mã hóa UTF-8
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

        // Tạo một instance của lớp Mac với thuật toán HmacSHA256
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKeySpec);

        // Thực hiện tính toán HMAC với dữ liệu UTF-8
        byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // Chuyển đổi kết quả sang chuỗi Base64
        return Base64.getEncoder().encodeToString(hmacBytes);
    }
}
