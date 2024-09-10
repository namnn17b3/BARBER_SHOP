package barbershop.user_service.services;

import lombok.*;

public abstract class JwtService {
    @Data
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString(of = {"id", "iat", "exp"})
    public static class PayLoad {
        private int id;
        private long iat;
        private long exp;
    }

    public abstract String generateToken(int id) throws Exception;
    public abstract PayLoad extractToken(String token) throws Exception;
}
