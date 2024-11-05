package barbershop.order_service.services;

import barbershop.order_service.Utils.Utils;
import barbershop.order_service.dtos.request.ChecksumEventRequest;
import barbershop.order_service.entities.Order;
import barbershop.order_service.enums.TimeZone;
import barbershop.order_service.repositories.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import payment.PaymentServiceGrpc;
import payment.SaveNewPaymentRequest;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class KafkaListenEventService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RedisService redisService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @GrpcClient("payment-grpc-server")
    private PaymentServiceGrpc.PaymentServiceBlockingStub paymentServiceBlockingStub;

    @Transactional
    @KafkaListener(id="handleChecksumEventGroup", topics="checksum")
    public void handleChecksumEvent(ChecksumEventRequest checksumEventRequest) throws Exception {
        if (checksumEventRequest.getChecksum() != 1) {
            return;
        }
        System.out.println(">>>>>>>>>>>>>>>>> handleChecksumEvent orderUUID: " + checksumEventRequest.getOrderUUID());
        String orderUUID = checksumEventRequest.getOrderUUID();
        String orderMapJsonValue = redisService.getValue(orderUUID);
        Map<String, Object> orderMap = objectMapper.readValue(orderMapJsonValue, LinkedHashMap.class);
        Order order = Order.builder()
            .userId((int) ((Map<String, Object>) orderMap.get("user")).get("id"))
            .orderTime(Utils.parseDate(orderMap.get("orderTime").toString(), "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value()))
            .schedule(Utils.parseDate(orderMap.get("schedule").toString(), "yyyy-MM-dd HH:mm", TimeZone.ASIA_HCM.value()))
            .cutted((boolean) orderMap.get("cutted"))
            .barber(objectMapper.writeValueAsString(orderMap.get("barber")))
            .hairStyle(objectMapper.writeValueAsString(orderMap.get("hairStyle")))
            .hairColor(orderMap.get("hairColor") == null ? "null" : objectMapper.writeValueAsString(orderMap.get("hairColor")))
        .build();

        order = orderRepository.save(order);
        orderMap.put("id", order.getId());

        paymentServiceBlockingStub.saveNewPayment(SaveNewPaymentRequest.newBuilder()
                        .setAmount(checksumEventRequest.getAmount())
                        .setOrderId(order.getId())
                        .setOrderUUID(checksumEventRequest.getOrderUUID())
                        .setExternalRequest(checksumEventRequest.getExternalRequest())
                        .setPayOnlineType(checksumEventRequest.getPayOnlineType())
                        .setPaymentStatus(checksumEventRequest.getPaymentStatus())
                .build());

        kafkaTemplate.send("send-email-thank-for-order", objectMapper.writeValueAsString(orderMap));
    }
}
