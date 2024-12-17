package barbershop.order_service.services.impl;

import barber.Barber;
import barber.BarberServiceGrpc;
import barber.GetAllBarberRequest;
import barber.GetDetailBarberRequest;
import barbershop.order_service.Utils.Utils;
import barbershop.order_service.dtos.request.FindOrderInfoRequest;
import barbershop.order_service.dtos.request.GetListOrderByUserRequest;
import barbershop.order_service.dtos.request.PaymentRequest;
import barbershop.order_service.dtos.request.StatisticQuantityRequest;
import barbershop.order_service.dtos.request.admin.GetListOrderForAdminRequest;
import barbershop.order_service.dtos.response.BaseResponse;
import barbershop.order_service.dtos.response.FieldErrorsResponse;
import barbershop.order_service.dtos.response.PaginationResponse;
import barbershop.order_service.entities.Order;
import barbershop.order_service.enums.TimeZone;
import barbershop.order_service.exception.ResourceNotFoundException;
import barbershop.order_service.repositories.OrderRepository;
import barbershop.order_service.services.OrderService;
import barbershop.order_service.services.RedisService;
import block_time.BlockTimeServiceGrpc;
import block_time.CheckBlockTimeRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import hairColor.GetDetailHairColorRequest;
import hairColor.HairColor;
import hairColor.HairColorServiceGrpc;
import hairStyle.GetDetailHairStyleRequest;
import hairStyle.HairStyle;
import hairStyle.HairStyleServiceGrpc;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import payment.*;
import user.GetListUserByIdsAndKeyWordRequest;
import user.User;
import user.UserServiceGrpc;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {
    @GrpcClient("user-grpc-server")
    private UserServiceGrpc.UserServiceBlockingStub userServiceBlockingStub;

    @GrpcClient("block-time-grpc-server")
    private BlockTimeServiceGrpc.BlockTimeServiceBlockingStub blockTimeServiceBlockingStub;

    @GrpcClient("barber-grpc-server")
    private BarberServiceGrpc.BarberServiceBlockingStub barberServiceBlockingStub;

    @GrpcClient("payment-grpc-server")
    private PaymentServiceGrpc.PaymentServiceBlockingStub paymentServiceBlockingStub;

    @GrpcClient("hair-style-grpc-server")
    private HairStyleServiceGrpc.HairStyleServiceBlockingStub hairStyleServiceBlockingStub;

    @GrpcClient("hair-color-grpc-server")
    private HairColorServiceGrpc.HairColorServiceBlockingStub hairColorServiceBlockingStub;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RedisService redisService;

    @Autowired
    private ObjectMapper objectMapper;

    private void checkValidDateAndTimeRequest(FindOrderInfoRequest findOrderInfoRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        Date correctDate = Utils.parseDate(findOrderInfoRequest.getDate()+" "+findOrderInfoRequest.getTime(), "yyyy-MM-dd HH:mm", TimeZone.ASIA_HCM.value());
        if (correctDate == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Invalid date and time")
                            .resource("FindBarberRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (!Utils.isDateInRange(findOrderInfoRequest.getDate()+" "+ findOrderInfoRequest.getTime(), "yyyy-MM-dd HH:mm", TimeZone.ASIA_HCM.value(), 0, 6)) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Error range date and time, date and time in range [0; 6] days")
                            .resource("FindBarberRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        List<String> timeSlots = Utils.generateTimeSlots();
        if (!timeSlots.contains(findOrderInfoRequest.getTime())) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("time")
                            .message("Invalid time slot")
                            .resource("FindBarberRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        boolean isBlocked = blockTimeServiceBlockingStub.checkBlockTime(CheckBlockTimeRequest.newBuilder()
                .setDate(findOrderInfoRequest.getDate())
                .setTime(findOrderInfoRequest.getTime())
                .build()
        ).getIsBlocked();

        if (isBlocked) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("date; time")
                            .message("Date and time is blocked")
                            .resource("FindBarberRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
    }

    @Override
    public BaseResponse findOrderInfo(FindOrderInfoRequest findOrderInfoRequest) throws Exception {
        checkValidDateAndTimeRequest(findOrderInfoRequest);
        List<Barber> barbers = barberServiceBlockingStub.getAllBarber(GetAllBarberRequest.newBuilder().build()).getDataList();
        List<Integer> barberIds = new ArrayList<>();
        for (Barber barber : barbers) {
            barberIds.add(barber.getId());
        }
        barberIds = orderRepository.findBarberIds(barberIds);

        if (barberIds.size() == 0) {
            return new BaseResponse(null);
        }

        int barberId = barberIds.get(0);
        Barber barber = null;
        for (Barber b : barbers) {
            if (b.getId() == barberId && b.getActive()) {
                barber = b;
            }
        }

        if (barber == null) {
            return new BaseResponse(null);
        }

        // find hairStyle and hairColor
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        HairStyle hairStyle = null;
        HairColor hairColor = null;
        Map<String, Object> hairStyleMap = new LinkedHashMap<>();
        Map<String, Object> hairColorMap = new LinkedHashMap<>();

        try {
            hairStyle = hairStyleServiceBlockingStub.getDetailHairStyle(GetDetailHairStyleRequest.newBuilder()
                    .setId(findOrderInfoRequest.getHairStyleId())
                    .build()).getHairStyle();

            if (findOrderInfoRequest.getHairColorId() != 0) {
                hairColor = hairColorServiceBlockingStub.getDetailHairColor(GetDetailHairColorRequest.newBuilder()
                        .setId(findOrderInfoRequest.getHairColorId())
                        .build()).getHairColor();
            }
        } catch (Exception exception) {
            log.error("ERROR", exception);
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("hair style, hair color")
                            .message("Hair style or hair color not found")
                            .resource("PaymentRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        int amount = hairStyle.getPrice();

        hairStyleMap.put("id", hairStyle.getId());
        hairStyleMap.put("name", hairStyle.getName());
        hairStyleMap.put("price", hairStyle.getPrice());
        hairStyleMap.put("active", hairStyle.getActive());
        if (hairStyle.getDiscount() != null) {
            Map<String, Object> discountMap = new LinkedHashMap<>();
            discountMap.put("unit", hairStyle.getDiscount().getUnit());
            discountMap.put("value", hairStyle.getDiscount().getValue());
            hairStyleMap.put("discount", discountMap);
            if (hairStyle.getDiscount().getUnit().equals("%")) {
                amount = amount * (100 - hairStyle.getDiscount().getValue()) / 100;
            } else {
                amount = amount - hairStyle.getDiscount().getValue();
            }
        }

        if (hairColor != null) {
            hairColorMap.put("id", hairColor.getId());
            hairColorMap.put("color", hairColor.getColor());
            hairColorMap.put("price", hairColor.getPrice());
            hairColorMap.put("active", hairColor.getActive());
            hairColorMap.put("colorCode", hairColor.getColorCode());
            amount = amount + hairColor.getPrice();
        }

        if (amount < 0) {
            amount = 0;
        }

        Map<String, Object> barberMap = new LinkedHashMap<>();
        barberMap.put("id", barber.getId());
        barberMap.put("name", barber.getName());
        barberMap.put("avatar", barber.getImg());
        barberMap.put("active", barber.getActive());

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("barber", barberMap);
        map.put("hairStyle", hairStyleMap);
        map.put("user", findOrderInfoRequest.getUser());
        if (hairColor != null) {
            map.put("hairColor", hairColorMap);
        }
        map.put("amount", amount);

        BaseResponse baseResponse = new BaseResponse(map);
        return baseResponse;
    }

    @Transactional
    @Override
    public BaseResponse payment(PaymentRequest paymentRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        if (!paymentRequest.getPaymentType().equals("VNPAY") && !paymentRequest.getPaymentType().equals("MOMO")) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("payment type")
                            .message("Payment type must be VNPAY or MOMO")
                            .resource("PaymentRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        Map<String, Object> orderInfoMap = (Map<String, Object>) findOrderInfo(FindOrderInfoRequest.builder()
                .date(paymentRequest.getDate())
                .time(paymentRequest.getTime())
                .hairStyleId(paymentRequest.getHairStyleId())
                .hairColorId(paymentRequest.getHairColorId())
                .build()).getData();

        Map<String, Object> barberMap = (Map<String, Object>) orderInfoMap.get("barber");
        Map<String, Object> hairStyleMap = (Map<String, Object>) orderInfoMap.get("hairStyle");
        Map<String, Object> hairColorMap = (Map<String, Object>) orderInfoMap.get("hairColor");
        int amount = (int) orderInfoMap.get("amount");

        Map<String, Object> orderMap = new LinkedHashMap<>();
        orderMap.put("user", paymentRequest.getUser());
        orderMap.put("schedule", paymentRequest.getDate()+" "+paymentRequest.getTime());
        orderMap.put("cutted", false);
        orderMap.put("barber", barberMap);
        orderMap.put("hairStyle", hairStyleMap);
        orderMap.put("hairColor", hairColorMap);
        orderMap.put("orderTime", Utils.toDateStringWithFormatAndTimezone(new Date(), "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value()));
        orderMap.put("amount", amount);
        orderMap.put("paymentType", paymentRequest.getPaymentType());

        String orderUUID = UUID.randomUUID().toString();
        redisService.setValue(orderUUID, objectMapper.writeValueAsString(orderMap), 1800000, TimeUnit.MILLISECONDS);

        TransactionResponse transactionResponse = paymentServiceBlockingStub.transaction(TransactionRequest.newBuilder()
                        .setOrderUUID(orderUUID)
                        .setPaymentType(paymentRequest.getPaymentType())
                        .setAmount(amount)
                .build());

        return new BaseResponse(Map.of("paymentUrl", transactionResponse.getPaymentUrl()));
    }

    @Override
    public PaginationResponse getListOrderByUser(GetListOrderByUserRequest getListOrderByUserRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        if (getListOrderByUserRequest.getSortBy() != null) {
            String regex = "^(asc|desc)$";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(getListOrderByUserRequest.getSortBy());
            if (!matcher.matches()) {
                listFieldErrors.add(
                        FieldErrorsResponse.FieldError.builder()
                                .field("sort by")
                                .message("Sort by must be most recent or longest")
                                .resource("GetListOrderByUserRequest")
                                .build()
                );
                throw FieldErrorsResponse
                        .builder()
                        .errors(listFieldErrors)
                        .build();
            }
        }

        if (getListOrderByUserRequest.getStatus() != null) {
            String regex = "^(success|canceled)$";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(getListOrderByUserRequest.getStatus());
            if (!matcher.matches()) {
                listFieldErrors.add(
                        FieldErrorsResponse.FieldError.builder()
                                .field("status")
                                .message("Status must be most success or cancel")
                                .resource("GetListOrderByUserRequest")
                                .build()
                );
                throw FieldErrorsResponse
                        .builder()
                        .errors(listFieldErrors)
                        .build();
            }
        }

        int orderId = 0;
        try {
            orderId = Integer.parseInt(getListOrderByUserRequest.getCodeOrHairStyle().split("BBSOD")[1].trim());
        } catch (Exception exception) {
            try {
                orderId = Integer.parseInt(getListOrderByUserRequest.getCodeOrHairStyle().trim());
            } catch (Exception exception1) {}
        }

        List<Order> orders = orderRepository.getListOrderByUser(
                orderId,
                getListOrderByUserRequest
        );

        List<Map<String, Object>> orderMapList = new ArrayList<>();
        List<Integer> orderIds = new ArrayList<>();
        for (Order order : orders) {
            orderIds.add(order.getId());
        }

        List<Payment> paymentGrpcs = (paymentServiceBlockingStub.getListPaymentByOrderIds(
                GetListPaymentByOrderIdsRequest.newBuilder()
                        .addAllOrderIds(orderIds)
                        .build()
        )).getPaymentsList();

        for (Order order : orders) {
            Map<String, Object> orderMap = new LinkedHashMap<>();
            orderMap.put("id", order.getId());
            Map<String, Object> hairStyleMap = objectMapper.readValue(order.getHairStyle(), LinkedHashMap.class);
            Map<String, Object> hairColorMap = objectMapper.readValue(order.getHairColor(), LinkedHashMap.class);
            orderMap.put("hairStyle", hairStyleMap.get("name"));
            if (hairColorMap != null) {
                orderMap.put("hairColor", Map.of("colorCode", hairColorMap.get("colorCode"), "color", hairColorMap.get("color")));
            }
            Payment paymentGrpc = findPaymentGrpcByOrderId(paymentGrpcs, order.getId());
            orderMap.put("orderTime", Utils.toDateStringWithFormatAndTimezone(order.getOrderTime(), "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value()));
            orderMap.put("paymentType", paymentGrpc.getType());
            orderMap.put("amount", paymentGrpc.getAmount());
            orderMapList.add(orderMap);
        }

        int totalRecords = orderRepository.countOrderByUser(orderId, getListOrderByUserRequest);

        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setData(orderMapList);
        paginationResponse.setMeta(
                PaginationResponse.Meta.builder()
                        .items(Integer.parseInt(getListOrderByUserRequest.getItems()))
                        .page(Integer.parseInt(getListOrderByUserRequest.getPage()))
                        .totalRecords(totalRecords)
                        .build()
        );

        return paginationResponse;
    }

    private Payment findPaymentGrpcByOrderId(List<Payment> paymentGrpcs, int orderId) {
        for (Payment paymentGrpc: paymentGrpcs) {
            if (paymentGrpc.getOrderId() == orderId) {
                return paymentGrpc;
            }
        }
        return null;
    }

    @Override
    public BaseResponse getOrderById(String orderIdString, Map<String, Object> user) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        int orderId = 0;
        try {
            orderId = Integer.parseInt(orderIdString);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Order id")
                            .message("Order id must be integer")
                            .resource("Path Variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (orderId < 1) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("Order id")
                            .message("Order id must be greater than 0")
                            .resource("Path Variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        Order order = null;
        if (user.get("role").toString().equalsIgnoreCase("ADMIN")) {
            order = orderRepository.findById(orderId).orElse(null);
        } else {
            order = orderRepository.findByUserIdAndId((int) user.get("id"), orderId).orElse(null);
        }
        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }

        Payment payment = findPaymentGrpcByOrderId(
                paymentServiceBlockingStub.getListPaymentByOrderIds(
                        GetListPaymentByOrderIdsRequest.newBuilder()
                                .addAllOrderIds(List.of(order.getId()))
                                .build()
                ).getPaymentsList(),
                order.getId()
        );

        Map<String, Object> orderMap = new LinkedHashMap<>();
        Map<String, Object> hairStyleMap = objectMapper.readValue(order.getHairStyle(), LinkedHashMap.class);
        Map<String, Object> hairColorMap = objectMapper.readValue(order.getHairColor(), LinkedHashMap.class);
        Map<String, Object> barberMap = objectMapper.readValue(order.getBarber(), LinkedHashMap.class);

        Barber barber = barberServiceBlockingStub.getDetailBarber(
                GetDetailBarberRequest.newBuilder()
                        .setId((int) barberMap.get("id"))
                        .build()
        ).getBarber();

        barberMap.put("avatar", barber.getImg());

        orderMap.put("id", order.getId());
        orderMap.put("amount", payment.getAmount());
        orderMap.put("status", Utils.capitalize(order.getStatus()));
        orderMap.put("paymentType", payment.getType());
        orderMap.put("bankCode", payment.getBankCode());
        orderMap.put("bankTranNo", payment.getBankTranNo());
        orderMap.put("cutted", order.isCutted());
        orderMap.put("schedule", Utils.toDateStringWithFormatAndTimezone(order.getSchedule(), "yyyy-MM-dd HH:mm", TimeZone.ASIA_HCM.value()));
        orderMap.put("orderTime", Utils.toDateStringWithFormatAndTimezone(order.getOrderTime(), "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value()));
        orderMap.put("user", user);
        orderMap.put("barber", barberMap);
        orderMap.put("hairStyle", hairStyleMap);
        orderMap.put("hairColor", hairColorMap);

        return new BaseResponse(orderMap);
    }

    @Override
    public BaseResponse getStatisticQuantity(StatisticQuantityRequest statisticQuantityRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();
        if (Utils.parseDate(statisticQuantityRequest.getYear()+"-"+statisticQuantityRequest.getMonth()+"-01 00:00:00", "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value()) == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("month and year")
                            .message("Invalid date format")
                            .resource("StatisticQuantityRequest")
                            .build()
            );

            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        int quantityCurrent = this.orderRepository.statisticQuantity(
                Integer.parseInt(statisticQuantityRequest.getMonth()),
                Integer.parseInt(statisticQuantityRequest.getYear())
        );
        String yyyyMMPrevious = Utils.getPreviousMonth(
                statisticQuantityRequest.getYear()+"-"+statisticQuantityRequest.getMonth(),
                "yyyy-MM-dd",
                TimeZone.ASIA_HCM.value()
        );
        int yyyyPrevious = Integer.parseInt(yyyyMMPrevious.split("-")[0]);
        int mmPrevious = Integer.parseInt(yyyyMMPrevious.split("-")[1]);
        int quantityPrevious = this.orderRepository.statisticQuantity(
                mmPrevious,
                yyyyPrevious
        );

        return new BaseResponse(Map.of(
                "yyyyMM", statisticQuantityRequest.getYear()+"-"+statisticQuantityRequest.getMonth(),
                "quantityCurrent", quantityCurrent,
                "quantityPrevious", quantityPrevious
        ));
    }

    @Override
    public BaseResponse getListOrderForAdmin(GetListOrderForAdminRequest getListOrderForAdminRequest) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        if (getListOrderForAdminRequest.getSortBy() != null) {
            String regex = "^(asc|desc)$";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(getListOrderForAdminRequest.getSortBy());
            if (!matcher.matches()) {
                listFieldErrors.add(
                        FieldErrorsResponse.FieldError.builder()
                                .field("sort by")
                                .message("Sort by must be most recent or longest")
                                .resource("GetListOrderForAdminRequest")
                                .build()
                );
                throw FieldErrorsResponse
                        .builder()
                        .errors(listFieldErrors)
                        .build();
            }
        }

        if (getListOrderForAdminRequest.getStatus() != null) {
            String regex = "^(success|canceled)$";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(getListOrderForAdminRequest.getStatus());
            if (!matcher.matches()) {
                listFieldErrors.add(
                        FieldErrorsResponse.FieldError.builder()
                                .field("status")
                                .message("Status must be most recent or longest")
                                .resource("GetListOrderForAdminRequest")
                                .build()
                );
                throw FieldErrorsResponse
                        .builder()
                        .errors(listFieldErrors)
                        .build();
            }
        }

        if (getListOrderForAdminRequest.getRange() == null || getListOrderForAdminRequest.getRange().isEmpty()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("range")
                            .message("Range is not empty")
                            .resource("GetListOrderForAdminRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (getListOrderForAdminRequest.getRange().split(",").length != 2) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("range")
                            .message("Invalid range format")
                            .resource("GetListOrderForAdminRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        Date startDate = Utils.parseDate(getListOrderForAdminRequest.getRange().split(",")[0].trim()+" 00:00:00", "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value());
        Date endDate = Utils.parseDate(getListOrderForAdminRequest.getRange().split(",")[1].trim()+" 00:00:00", "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value());
        if (startDate == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("start date")
                            .message("Invalid range: invalid start date")
                            .resource("GetListOrderForAdminRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }
        if (endDate == null) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("end date")
                            .message("Invalid range: invalid end date")
                            .resource("GetListOrderForAdminRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (startDate.getTime() > endDate.getTime()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("start date")
                            .message("Invalid range: start date must be less than or equals end date")
                            .resource("GetListOrderForAdminRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (endDate.getTime() - startDate.getTime() > 6 * 24 * 60 * 60 * 1000) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("start date")
                            .message("Invalid range: range in [0;7] days")
                            .resource("GetListOrderForAdminRequest")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        int orderId = 0;
        try {
            orderId = Integer.parseInt(getListOrderForAdminRequest.getKeyword().split("BBSOD")[1].trim());
        } catch (Exception exception) {
            try {
                orderId = Integer.parseInt(getListOrderForAdminRequest.getKeyword().trim());
            } catch (Exception exception1) {}
        }

        List<Order> orders = orderRepository.getListOrderForAdmin(getListOrderForAdminRequest);
        List<User> users = new ArrayList<>();
        orders = this.filterListOrderForAdminByKeyword(
                orders,
                users,
                orderId,
                getListOrderForAdminRequest.getKeyword()
        );

        int page = Integer.parseInt(getListOrderForAdminRequest.getPage());
        int items = Integer.parseInt(getListOrderForAdminRequest.getItems());
        int startIdx = (page - 1) * items;
        int endIdx = Math.min(startIdx + items, orders.size());
        List<Integer> orderIds = new ArrayList<>();
        for (int i = startIdx; i < endIdx; i++) {
            Order order = orders.get(i);
            orderIds.add(order.getId());
        }

        List<Payment> paymentGrpcs = (paymentServiceBlockingStub.getListPaymentByOrderIds(
                GetListPaymentByOrderIdsRequest.newBuilder()
                        .addAllOrderIds(orderIds)
                        .build()
        )).getPaymentsList();

        List<Map<String, Object>> orderMapList = new ArrayList<>();
        for (int i = startIdx; i < endIdx; i++) {
            Order order = orders.get(i);
            Map<String, Object> orderMap = new LinkedHashMap<>();
            orderMap.put("id", order.getId());
            Map<String, Object> hairStyleMap = objectMapper.readValue(order.getHairStyle(), LinkedHashMap.class);
            Map<String, Object> hairColorMap = objectMapper.readValue(order.getHairColor(), LinkedHashMap.class);
            User user = users.stream().filter(u -> u.getId() == order.getUserId()).findFirst().orElse(null);
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            orderMap.put("user", userMap);
            orderMap.put("hairStyle", hairStyleMap.get("name"));
            if (hairColorMap != null) {
                orderMap.put("hairColor", Map.of("colorCode", hairColorMap.get("colorCode"), "color", hairColorMap.get("color")));
            }
            Payment paymentGrpc = findPaymentGrpcByOrderId(paymentGrpcs, order.getId());
            orderMap.put("orderTime", Utils.toDateStringWithFormatAndTimezone(order.getOrderTime(), "yyyy-MM-dd HH:mm:ss", TimeZone.ASIA_HCM.value()));
            orderMap.put("paymentType", paymentGrpc.getType());
            orderMap.put("amount", paymentGrpc.getAmount());
            orderMap.put("status", Utils.capitalize(order.getStatus()));
            orderMap.put("cutted", order.isCutted());

            orderMapList.add(orderMap);
        }

        int totalRecords = orders.size();

        PaginationResponse paginationResponse = new PaginationResponse();
        paginationResponse.setData(orderMapList);
        paginationResponse.setMeta(
                PaginationResponse.Meta.builder()
                        .items(Integer.parseInt(getListOrderForAdminRequest.getItems()))
                        .page(Integer.parseInt(getListOrderForAdminRequest.getPage()))
                        .totalRecords(totalRecords)
                        .build()
        );

        return paginationResponse;
    }

    private List<Order> filterListOrderForAdminByKeyword(List<Order> orders, List<User> users, int orderId, String keyword) {
        List<Integer> ids = new ArrayList<>();
        for (Order order : orders) {
            ids.add(order.getUserId());
        }
        GetListUserByIdsAndKeyWordRequest getListUserByIdsAndKeyWordRequest = GetListUserByIdsAndKeyWordRequest.newBuilder()
                .addAllIds(ids)
                .build();
        List<User> userGrpcs = userServiceBlockingStub.getListUserByIdsAndKeyWord(getListUserByIdsAndKeyWordRequest).getUsersList();
        for (User user : userGrpcs) {
            users.add(user);
        }
        if (keyword != null && !keyword.isEmpty()) {
            List<User> finalUsers = users;
            orders = orders.stream().filter(order -> {
                Map<String, Object> hairStyleMap = null;
                try {
                    User user = finalUsers.stream().filter(u -> u.getId() == order.getUserId()).findFirst().orElse(null);
                    hairStyleMap = objectMapper.readValue(order.getHairStyle(), LinkedHashMap.class);
                    return order.getId() == orderId ||
                            hairStyleMap.get("name").toString().contains(keyword) ||
                            user.getEmail().contains(keyword) ||
                            user.getUsername().contains(keyword);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
        }

        return orders;
    }

    @Override
    public BaseResponse makeCutted(String orderId) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        int id = 0;
        try {
            id = Integer.parseInt(orderId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("order id")
                            .message("Invalid integer format")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }

        if (order.getStatus().equalsIgnoreCase("CANCELED")) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("order id")
                            .message("Order status was cancel")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (order.isCutted()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("order id")
                            .message("Not mark cutted when order is marked cutted")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        order.setCutted(true);
        orderRepository.save(order);

        return new BaseResponse(Map.of("message", "Mark cutted successfully"));
    }

    @Override
    public BaseResponse getScheduleRecently(Map<String, Object> user) throws Exception {
        String schedule = orderRepository.getScheduleRecently((int) user.get("id"));
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("schedule", schedule);
        return new BaseResponse(data);
    }

    @Override
    public BaseResponse cancelOrder(String orderId, Map<String, Object> user) throws Exception {
        List<FieldErrorsResponse.FieldError> listFieldErrors = new ArrayList<>();

        int id = 0;
        try {
            id = Integer.parseInt(orderId);
        } catch (Exception exception) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("order id")
                            .message("Invalid integer format")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        Order order = orderRepository.findByUserIdAndId((int) user.get("id"), id).orElse(null);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }

        if (order.isCutted()) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("order id")
                            .message("User used service")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        long time = new Date().getTime() - order.getOrderTime().getTime();
        if (!(time >= 0 && time <= 60 * 60 * 1000)) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("order id")
                            .message("You can only cancel order within 1 hour of placing your order")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        if (order.getStatus().equalsIgnoreCase("CANCELED")) {
            listFieldErrors.add(
                    FieldErrorsResponse.FieldError.builder()
                            .field("order id")
                            .message("Order status was cancel")
                            .resource("Path variable")
                            .build()
            );
            throw FieldErrorsResponse
                    .builder()
                    .errors(listFieldErrors)
                    .build();
        }

        order.setStatus("CANCEL");
        orderRepository.save(order);

        return new BaseResponse(Map.of("message", "Cancel order successfully"));
    }
}
