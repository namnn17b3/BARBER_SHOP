package barbershop.user_service.interceptors;

import barbershop.user_service.dtos.response.AppBaseResponse;
import barbershop.user_service.dtos.response.UserDetailResponse;
import barbershop.user_service.exception.HttpException;
import barbershop.user_service.services.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
public class AuthenticationInterceptor implements HandlerInterceptor {
    @Autowired
    private AuthenticationService authenticationService;

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
        AppBaseResponse appBaseResponse = authenticationService.me(token);
        UserDetailResponse userDetailResponse = (UserDetailResponse) appBaseResponse.getData();

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
