package barbershop.hair_color_service.interceptors;

import barbershop.hair_color_service.exception.HttpException;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import user.CheckAuthenRequest;
import user.CheckAuthenResponse;
import user.UserServiceGrpc;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
public class AdminCheckInterceptor implements HandlerInterceptor {
    @GrpcClient("user-grpc-server")
    private UserServiceGrpc.UserServiceBlockingStub userServiceBlockingStub;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorizationHeader = request.getHeader("Authorization");

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return true;
        }

        if (authorizationHeader == null) {
            throw new HttpException("Unauthorized", 401);
        }
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ") && authorizationHeader.split("\\s+").length != 2) {
            throw new HttpException("Unauthorized", 401);
        }

        String token = authorizationHeader.split("\\s+")[1];
        CheckAuthenResponse checkAuthenResponse = null;
        try {
            checkAuthenResponse = userServiceBlockingStub.checkAuthen(
                    CheckAuthenRequest.newBuilder()
                            .setToken(token)
                            .build()
            );
        } catch (Exception e) {
            log.error("ERROR", e);
            if (
                    e instanceof io.grpc.StatusRuntimeException
                            && ((StatusRuntimeException) e).getStatus().getCode().value() == Status.UNAUTHENTICATED.getCode().value()
            ) {
                throw new HttpException("Unauthorized", 401);
            }
            throw e;
        }

        if (!checkAuthenResponse.getUser().getRole().equalsIgnoreCase("ADMIN")) {
            throw new HttpException("Unauthorized", 401);
        }

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", checkAuthenResponse.getUser().getId());
        userMap.put("username", checkAuthenResponse.getUser().getUsername());
        userMap.put("email", checkAuthenResponse.getUser().getEmail());
        userMap.put("avatar", checkAuthenResponse.getUser().getAvatar());
        userMap.put("address", checkAuthenResponse.getUser().getAddress());
        userMap.put("phone", checkAuthenResponse.getUser().getPhone());
        userMap.put("role", checkAuthenResponse.getUser().getRole());
        userMap.put("gender", checkAuthenResponse.getUser().getGender());

        request.setAttribute("user", userMap);
        return true;
    }
}


