package barbershop.order_service.wrappers;

import lombok.extern.slf4j.Slf4j;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Slf4j
public class ChangeHttpServletRequestJsonBodyWrapper extends HttpServletRequestWrapper {
    private String requestBody;

    public ChangeHttpServletRequestJsonBodyWrapper(HttpServletRequest request) throws IOException {
        super(request);
        this.requestBody = this.getBodyFromRequest(request);
        System.out.println(">>>>>>>>> this.requestBody " + this.requestBody);
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        System.out.println(">>>>>>>>> ServletInputStream getInputStream this.requestBody " + this.requestBody);
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(this.requestBody.getBytes(StandardCharsets.UTF_8));
        return new ServletInputStream() {
            @Override
            public boolean isFinished() {
                return byteArrayInputStream.available() == 0;
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setReadListener(ReadListener readListener) {
                // No implementation needed
            }

            @Override
            public int read() throws IOException {
                return byteArrayInputStream.read();
            }
        };
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(this.getInputStream(), StandardCharsets.UTF_8));
    }

    public String getRequestBody() {
        return this.requestBody;
    }

    public void setRequestBody(String body) {
        this.requestBody = body;
    }

    private String getBodyFromRequest(HttpServletRequest request) throws IOException {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream(), StandardCharsets.UTF_8));
            return reader.lines().collect(Collectors.joining(System.lineSeparator()));
        } catch (Exception exception) {
            log.error("ERROR", exception);
            throw exception;
        }

//        try (
//                InputStream inputStream = request.getInputStream();
//                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
//        ) {
//            return reader.lines().collect(java.util.stream.Collectors.joining(System.lineSeparator()));
//        }
    }
}
