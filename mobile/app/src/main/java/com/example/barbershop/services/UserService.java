package com.example.barbershop.services;

import com.example.barbershop.constant.AppConstant;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.concurrent.TimeUnit;

import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Query;

public interface UserService {
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    // Tạo OkHttpClient với thời gian timeout tùy chỉnh
    OkHttpClient okHttpClient = new OkHttpClient.Builder()
            .connectTimeout(90, TimeUnit.SECONDS) // Thời gian chờ kết nối
            .readTimeout(90, TimeUnit.SECONDS)    // Thời gian chờ đọc dữ liệu
            .writeTimeout(90, TimeUnit.SECONDS)   // Thời gian chờ ghi dữ liệu
            .build();

    UserService userService = new Retrofit.Builder()
            .baseUrl(AppConstant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .client(okHttpClient) // Sử dụng OkHttpClient tùy chỉnh
            .build()
            .create(UserService.class);

    @POST("/api/users/authen/login")
    Call<ResponseBody> login(@Body RequestBody body);

    @GET("/api/users/authen/me")
    Call<ResponseBody> me(@Query("token") String token);

    @GET("/api/users/authen/logout")
    Call<ResponseBody> logout(@Query("token") String token);

    @Multipart
    @PUT("/api/users")
    Call<ResponseBody> updateProfile(
            @Header("Authorization") String bearerToken,
            @Part("username") RequestBody username,
            @Part("phone") RequestBody phone,
            @Part("address") RequestBody address,
            @Part("gender") RequestBody gender,
            @Part MultipartBody.Part image);

    @PUT("/api/users/change-password")
    Call<ResponseBody> changePassword(
            @Header("Authorization") String bearerToken,
            @Body RequestBody body);

    @Multipart
    @POST("/api/users/authen/register")
    Call<ResponseBody> register(
            @Part("email") RequestBody email,
            @Part("username") RequestBody username,
            @Part("password") RequestBody password,
            @Part("phone") RequestBody phone,
            @Part("address") RequestBody address,
            @Part("gender") RequestBody gender,
            @Part MultipartBody.Part avatar);

    @POST("/api/users/authen/forgot-password")
    Call<ResponseBody> forgotPassword(@Body RequestBody body);
}
