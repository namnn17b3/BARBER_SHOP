package com.example.barbershop.services;

import com.example.barbershop.constant.AppConstant;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.Map;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface HairStyleService {
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    HairStyleService hairStyleService = new Retrofit.Builder()
            .baseUrl(AppConstant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(HairStyleService.class);

    @GET("/api/hair-styles/image-url")
    Call<Map<String, Object>> getListHairStyleImage(
            @Query("name") String name,
            @Query("page") String page,
            @Query("items") String items);

    @GET("/api/hair-styles")
    Call<Map<String, Object>> getListHairStyle(
            @Query("name") String name,
            @Query("sorting") String sorting,
            @Query("page") String page,
            @Query("items") String items);

    @GET("/api/hair-styles/{id}")
    Call<Map<String, Object>> getDetailHairStyle(@Path("id") int id);
}
