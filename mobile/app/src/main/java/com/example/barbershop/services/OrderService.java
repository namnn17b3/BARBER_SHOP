package com.example.barbershop.services;

import com.example.barbershop.constant.AppConstant;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface OrderService {
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    OrderService orderService = new Retrofit.Builder()
            .baseUrl(AppConstant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(OrderService.class);

    @GET("/api/orders/schedule-recently")
    Call<ResponseBody> getScheduleRecently(@Header("Authorization") String bearerToken);

    @GET("/api/orders/find-order-info")
    Call<ResponseBody> findOrderInfo(
            @Header("Authorization") String bearerToken,
            @Query("date") String date,
            @Query("time") String time,
            @Query("hairStyleId") int hairStyleId,
            @Query("hairColorId") int hairColorId);

    @POST("/api/orders/payment")
    Call<ResponseBody> getPaymentUrl(
            @Header("Authorization") String bearerToken,
            @Body RequestBody body);

    @GET("/api/orders")
    Call<ResponseBody> getListOrderHistory(
            @Header("Authorization") String bearerToken,
            @Query("codeOrHairStyle") String codeOrHairStyle,
            @Query("sortBy") String sortBy,
            @Query("status") String status,
            @Query("page") String page,
            @Query("items") String items);

    @GET("/api/orders/{id}")
    Call<ResponseBody> getOrderDetail(
            @Header("Authorization") String bearerToken,
            @Path("id") int orderId);

    @PUT("/api/orders/cancel-order/{id}")
    Call<ResponseBody> cancelOrder(
            @Header("Authorization") String bearerToken,
            @Header("Content-Type") String contentType,
            @Path("id") int orderId);
}
