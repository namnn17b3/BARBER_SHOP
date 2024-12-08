package barbershop.user_service.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig {
        @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("*") // Allowed HTTP methods
                        .allowedHeaders("*") // Allowed request headers
                        .allowCredentials(false)
                        .maxAge(3600);
            }
        };
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Sử dụng StringRedisSerializer để serialize key
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());

        return template;
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

//    @Bean
//    public CommonsMultipartResolver multipartResolver() {
//        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
//        resolver.setDefaultEncoding("UTF-8");
//        resolver.setMaxUploadSize(10 * 1024 * 1024); // 10MB tổng kích thước request
//        resolver.setMaxUploadSizePerFile(5 * 1024 * 1024); // 5MB mỗi file
//        return resolver;
//    }

//    @Bean
//    public FilterRegistrationBean<RequestMethodFilter> loggingFilter() {
//        FilterRegistrationBean<RequestMethodFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new RequestMethodFilter());
//        registrationBean.addUrlPatterns("/*"); // Áp dụng cho các endpoint bắt đầu bằng /api/
//        registrationBean.setOrder(1); // Ưu tiên thực thi (số nhỏ hơn được thực thi trước)
//        return registrationBean;
//    }
}
