package barbershop.user_service.interceptors;

import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.UserDetailResponse;
import barbershop.user_service.exception.HttpException;
import barbershop.user_service.services.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
public class AdminCheckInterceptor implements HandlerInterceptor {
    @Autowired
    private AuthenticationService authenticationService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorizationHeader = request.getHeader("Authorization");

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
        AppBaseResponse appBaseResponse = authenticationService.me(token);
        UserDetailResponse userDetailResponse = (UserDetailResponse) appBaseResponse.getData();

        if (!userDetailResponse.getRole().name().equalsIgnoreCase("admin")) {
            throw new HttpException("Admin role unauthorized", 401);
        }

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", userDetailResponse.getId());
        userMap.put("username", userDetailResponse.getUsername());
        userMap.put("email", userDetailResponse.getEmail());
        userMap.put("avatar", userDetailResponse.getAvatar());
        userMap.put("address", userDetailResponse.getAddress());
        userMap.put("phone", userDetailResponse.getPhone());
        userMap.put("role", userDetailResponse.getRole());
        userMap.put("gender", userDetailResponse.getGender());

        request.setAttribute("user", userMap);
        return true;
    }
}
