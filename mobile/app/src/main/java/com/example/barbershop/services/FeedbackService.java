package com.example.barbershop.services;

import com.example.barbershop.constant.AppConstant;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.Map;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface FeedbackService {
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    FeedbackService feedbackService = new Retrofit.Builder()
            .baseUrl(AppConstant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(FeedbackService.class);

    @GET("/api/feedbacks")
    Call<Map<String, Object>> getListReview(
            @Header("Authorization") String bearerToken,
            @Query("hairStyleId") int hairStyleId,
            @Query("minStar") String minStar,
            @Query("maxStar") String maxStar,
            @Query("startDate") String gender,
            @Query("endDate") String endDate,
            @Query("sorting") String sorting,
            @Query("page") String page,
            @Query("items") String items);

    @GET("/api/feedbacks/statistics")
    Call<Map<String, Object>> getStatisticFeedback(@Query("hairStyleId") int hairStyleId);

    @GET("/api/feedbacks/order/{id}")
    Call<Map<String, Object>> getFeedbackByUserAndOrder(
            @Header("Authorization") String bearerToken,
            @Path("id") int orderId);

    @POST("/api/feedbacks")
    Call<Map<String, Object>> createNewFeedback(
            @Header("Authorization") String bearerToken,
            @Body RequestBody body);

    @PUT("/api/feedbacks/{id}")
    Call<Map<String, Object>> updateFeedback(
            @Header("Authorization") String bearerToken,
            @Path("id") int id,
            @Body RequestBody body);

    @DELETE("/api/feedbacks/{id}")
    Call<Map<String, Object>> deleteFeedback(
            @Header("Authorization") String bearerToken,
            @Header("Content-Type") String contentType,
            @Path("id") int id);
}
