package com.example.barbershop.services;

import com.example.barbershop.constant.AppConstant;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.Map;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface HairColorService {
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    HairColorService hairColorService = new Retrofit.Builder()
            .baseUrl(AppConstant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(HairColorService.class);

    @GET("/api/hair-colors")
    Call<Map<String, Object>> getListHairColor();

    @GET("/api/hair-colors/color-image")
    Call<Map<String, Object>> getListColorImage(
            @Query("color") String color,
            @Query("page") String page,
            @Query("items") String items);
}
