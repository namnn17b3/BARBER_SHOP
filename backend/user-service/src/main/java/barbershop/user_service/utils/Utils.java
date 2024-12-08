package barbershop.user_service.utils;

import barbershop.user_service.exception.ImageFileTypeException;
import lombok.extern.slf4j.Slf4j;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

@Slf4j
public class Utils {
    public static String capitalize(String s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    public static String camelToPascal(String camelCase) {
        if (camelCase == null || camelCase.isEmpty()) {
            return camelCase;
        }
        // Chuyển ký tự đầu tiên thành chữ hoa và nối với phần còn lại của chuỗi
        return camelCase.substring(0, 1).toUpperCase() + camelCase.substring(1);
    }

    public static String readJsonBody(HttpServletRequest request) throws IOException {
        try (
                InputStream inputStream = request.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
        ) {
            return reader.lines().collect(java.util.stream.Collectors.joining(System.lineSeparator()));
        }
    }

    public static Date parseDate(String input, String format, String timezone) {
        try {
            // Định dạng ngày tháng theo chuỗi nhập vào
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);

            // Chuyển chuỗi thành LocalDateTime
            LocalDateTime.parse(input, formatter);

            // Khởi tạo SimpleDateFormat với định dạng truyền vào
            SimpleDateFormat sdf = new SimpleDateFormat(format);

            // Thiết lập múi giờ cho SimpleDateFormat
            sdf.setTimeZone(TimeZone.getTimeZone(timezone));

            // Parse chuỗi input thành đối tượng Date
            return sdf.parse(input);
        } catch (Exception e) {
            // Xử lý ngoại lệ nếu chuỗi input không hợp lệ
            log.error("ERROR", e);
        }
        return null;
    }

    public static boolean isDateInRange(String dateStr, String format, String timezone, int minUnit, int maxUnit) {
        try {
            // Định dạng ngày tháng theo chuỗi nhập vào
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);

            // Chuyển chuỗi thành LocalDateTime
            LocalDateTime inputDate = LocalDateTime.parse(dateStr, formatter);

            // Chuyển LocalDateTime sang múi giờ +7
            ZoneId zoneId = ZoneId.of(timezone); // UTC+7
            ZonedDateTime inputDateTimeWithZone = inputDate.atZone(zoneId);

            // Lấy thời gian hiện tại với múi giờ +7
            ZonedDateTime currentDateTimeWithZone = ZonedDateTime.now(zoneId);

            // Tính số ngày giữa thời gian nhập và thời gian hiện tại
            long daysDifference = ChronoUnit.DAYS.between(currentDateTimeWithZone, inputDateTimeWithZone);

            // Kiểm tra xem số ngày có nằm trong khoảng từ 0 đến 6
            return daysDifference >= minUnit && daysDifference <= maxUnit;

        } catch (Exception e) {
            log.error("ERROR", e);
            return false;
        }
    }

    public static List<String> generateTimeSlots() {
        List<String> times = new ArrayList<>();

        for (int hour = 8; hour <= 20; hour++) {
            String timeString = (hour < 10 ? "0" : "") + hour + ":00";
            times.add(timeString);

            if (hour != 20) {
                String halfHourString = (hour < 10 ? "0" : "") + hour + ":30";
                times.add(halfHourString);
            }
        }

        return times;
    }

    public static String toDateStringWithFormatAndTimezone(Date date, String format, String timezone) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        sdf.setTimeZone(TimeZone.getTimeZone(timezone));
        return sdf.format(date);
    }

    // For java 8, 11
//    public static String encodeURIComponent(String s) throws Exception {
//        ScriptEngineManager factory = new ScriptEngineManager();
//        ScriptEngine engine = factory.getEngineByName("js");
//
//        String script = "encodeURIComponent('"+s+"')";
//        Object result = engine.eval(script);
//        return result.toString();
//    }

    public static String encodeURIComponent(String s) throws Exception {
        Context context = Context
                .newBuilder("js")
                .option("engine.WarnInterpreterOnly", "false")
                .build();
        Value result = context.eval("js", "encodeURIComponent('"+s+"')");
        return result.toString();
    }

    public static String getExtendFile(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ""; // Trả về chuỗi rỗng nếu không có phần mở rộng
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    public static String getPreviousMonth(String yyyyMM, String format, String timezone) {
        // Định dạng ngày theo định dạng yyyy-MM
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);

        LocalDate ddMMYYYY = LocalDate.parse(yyyyMM + "-01", formatter);

        // Chuyển đổi chuỗi thành ZonedDateTime với ngày đầu tiên của tháng và múi giờ
        ZonedDateTime zonedDateTime = ddMMYYYY.atStartOfDay(ZoneId.of(timezone));

        // Lấy tháng trước đó
        ZonedDateTime monthPrevious = zonedDateTime.minusMonths(1);

        // Trả về chuỗi định dạng yyyy-MM của tháng trước đó
        return monthPrevious.format(formatter);
    }

    public static String stripAccents(String s) {
        s = Normalizer.normalize(s, Normalizer.Form.NFD);
        s = s.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        return s;
    }

    public static void checkImageFileType(MultipartFile multipartFile, String field, String resource) {
        String contentType = multipartFile.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/png") || contentType.equals("image/jpeg") || contentType.equals("image/jpg"))) {
            throw new ImageFileTypeException("Only PNG, JPG, and JPEG files are allowed", field, resource);
        }
    }
}
