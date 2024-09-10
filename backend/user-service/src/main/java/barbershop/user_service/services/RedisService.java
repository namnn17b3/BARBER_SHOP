package barbershop.user_service.services;

import java.util.concurrent.TimeUnit;

public interface RedisService {
    void setValue(String key, String value);
    void setValue(String key, String value, long timeout, TimeUnit unit);
    String getValue(String key);
    void deleteKey(String key);
}
