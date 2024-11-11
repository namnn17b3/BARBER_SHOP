package barbershop.user_service.configuration;

import barbershop.user_service.interceptors.AuthenticationInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Autowired
    private AuthenticationInterceptor authenticationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // first interceptor
        registry.addInterceptor(authenticationInterceptor)
                .addPathPatterns(
                        "/api/users",
                        "/api/users/change-password"
                )  // Áp dụng cho tất cả các endpoint bắt đầu bằng /api
                .excludePathPatterns("/api/public/**");  // Bỏ qua các endpoint công khai

        // Second interceptor
//        registry.addInterceptor(authenticationInterceptor)
//                .addPathPatterns("/api/orders/payment", "/api/orders")  // Áp dụng cho tất cả các endpoint bắt đầu bằng /api
//                .excludePathPatterns("/api/public/**");  // Bỏ qua các endpoint công khai

        WebMvcConfigurer.super.addInterceptors(registry);
    }
}
