package barbershop.order_service.interceptors;

import barbershop.order_service.Utils.Utils;
import barbershop.order_service.exception.HttpException;
import barbershop.order_service.wrappers.ChangeHttpServletRequestJsonBodyWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import user.CheckAuthenRequest;
import user.CheckAuthenResponse;
import user.UserServiceGrpc;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
public class AuthenticationInterceptor implements HandlerInterceptor {
    @GrpcClient("user-grpc-server")
    private UserServiceGrpc.UserServiceBlockingStub userServiceBlockingStub;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println(">>>>>>>>>>> AuthenticationInterceptor.preHandle");
        String authorizationHeader = request.getHeader("Authorization");
        System.out.println(">>>>>>>>>>> authorizationHeader: " + authorizationHeader);

        if (request.getMethod().equals("OPTIONS")) {
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

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", checkAuthenResponse.getUser().getId());
        userMap.put("username", checkAuthenResponse.getUser().getUsername());
        userMap.put("email", checkAuthenResponse.getUser().getEmail());
        userMap.put("avatar", checkAuthenResponse.getUser().getAvatar());
        userMap.put("address", checkAuthenResponse.getUser().getAddress());
        userMap.put("phone", checkAuthenResponse.getUser().getPhone());
        userMap.put("role", checkAuthenResponse.getUser().getRole());
        userMap.put("gender", checkAuthenResponse.getUser().getGender());

        if (request.getMethod().equals("GET")) {
            request.setAttribute("user", userMap);
            return true;
        }

        ChangeHttpServletRequestJsonBodyWrapper requestWrapper = new ChangeHttpServletRequestJsonBodyWrapper(request);
        Map<String, Object> map = objectMapper.readValue(requestWrapper.getRequestBody(), LinkedHashMap.class);
        map.put("user", userMap);
        String newJsonBody = objectMapper.writeValueAsString(map);
        System.out.println(">>>>>>>>>>> newJsonBody: " + newJsonBody);
//        requestWrapper.setRequestBody(newJsonBody);

//        request = requestWrapper;
        System.out.println(">>>>>>>>>>> request body TEST: " + Utils.readJsonBody(request));
        ((ChangeHttpServletRequestJsonBodyWrapper) request).setRequestBody(newJsonBody);

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println(">>>>>>>>>>> AuthenticationInterceptor.postHandle");
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println(">>>>>>>>>>> AuthenticationInterceptor.afterCompletion");
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
