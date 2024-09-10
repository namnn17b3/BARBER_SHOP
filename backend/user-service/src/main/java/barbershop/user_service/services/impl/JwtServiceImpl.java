package barbershop.user_service.services.impl;

import barbershop.user_service.securities.Hash;
import barbershop.user_service.services.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JwtServiceImpl extends JwtService {
    @Value("${jwt.token.secretKey}")
    private String secret;

    @Value("${jwt.expire}")
    private String expire;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public String generateToken(int id) throws Exception {
        String headerBase64Encode = Base64.getEncoder().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        String payload = this.objectMapper.writeValueAsString(PayLoad
                .builder()
                        .id(id)
                        .iat(System.currentTimeMillis())
                        .exp(System.currentTimeMillis() + Long.parseLong(expire))
                .build());
        String payloadBase64Encode = Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = Hash.hmacSha256(headerBase64Encode + "." + payloadBase64Encode, secret);
        String jwtToken = headerBase64Encode + "." + payloadBase64Encode + "." + signature;

        return jwtToken;
    }

    @Override
    public PayLoad extractToken(String token) throws Exception {
        String regex = "^([^.]+)\\.([^.]+)\\.([^.]+)$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(token);
        if (matcher.matches()) {
            String payload = new String(Base64.getDecoder().decode(matcher.group(2).getBytes(StandardCharsets.UTF_8)),
                    StandardCharsets.UTF_8);

            PayLoad payLoad = this.objectMapper.readValue(payload, PayLoad.class);

            return payLoad;
        }
        return null;
    }
}
