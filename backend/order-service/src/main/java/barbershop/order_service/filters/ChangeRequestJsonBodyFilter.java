package barbershop.order_service.filters;
import barbershop.order_service.wrappers.ChangeHttpServletRequestJsonBodyWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
@WebFilter(urlPatterns = {"/api/orders"})
public class ChangeRequestJsonBodyFilter implements Filter {
    @Autowired
    ObjectMapper objectMapper;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println(">>>>>>>>>>> ChangeRequestJsonBodyFilter run");
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
//
//        if (request.getMethod().equals("POST")) {
//            System.out.println(">>>>>>>>>>> ChangeRequestJsonBodyFilter run POST");
            ChangeHttpServletRequestJsonBodyWrapper requestWrapper = new ChangeHttpServletRequestJsonBodyWrapper(request);
//            Map<String, Object> map = objectMapper.readValue(requestWrapper.getRequestBody(), LinkedHashMap.class);
//            map.put("userId", 100);
//            String newJsonBody = objectMapper.writeValueAsString(map);
//            requestWrapper.setRequestBody(newJsonBody);
            filterChain.doFilter(requestWrapper, response);
//            return;
//        }


//        filterChain.doFilter(request, response);
    }
}
