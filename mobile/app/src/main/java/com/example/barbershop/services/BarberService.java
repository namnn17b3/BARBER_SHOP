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

public interface BarberService {
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    BarberService barberService = new Retrofit.Builder()
            .baseUrl(AppConstant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(BarberService.class);

    @GET("/api/barbers")
    Call<Map<String, Object>> getListBarber(
            @Query("name") String name,
            @Query("ageMin") String ageMin,
            @Query("ageMax") String ageMax,
            @Query("gender") String gender,
            @Query("page") String page,
            @Query("items") String items);

    @GET("/api/barbers/{id}")
    Call<Map<String, Object>> getBarberDetail(@Path("id") int id);
}
