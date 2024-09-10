package barbershop.user_service.services.impl;

import barbershop.user_service.services.RedisService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.concurrent.TimeUnit;

@Service
public class RedisServiceImpl implements RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public void setValue(String key, String value) {
        redisTemplate.opsForValue().set(key, value); // Thêm key-value vào Redis
    }

    // Thêm key-value vào Redis với TTL
    @Override
    public void setValue(String key, String value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    @Override
    public String getValue(String key) {
        return (String) redisTemplate.opsForValue().get(key); // Lấy giá trị từ Redis
    }

    @Override
    public void deleteKey(String key) {
        redisTemplate.delete(key);
    }
}
