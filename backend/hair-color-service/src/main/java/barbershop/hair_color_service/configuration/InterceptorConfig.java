package barbershop.hair_color_service.configuration;

import barbershop.hair_color_service.interceptors.AdminCheckInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Autowired
    private AdminCheckInterceptor adminCheckInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminCheckInterceptor)
                .addPathPatterns("/api/hair-colors/admin/**")
                .excludePathPatterns("/api/public/**");

        WebMvcConfigurer.super.addInterceptors(registry);
    }
}
