package com.example.barbershop.services;

import com.example.barbershop.constant.AppConstant;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface HairFastGanService {
    Gson gson = new GsonBuilder()
            .setLenient() // Bật chế độ lenient
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    // Tạo OkHttpClient với thời gian timeout tùy chỉnh
    OkHttpClient okHttpClient = new OkHttpClient.Builder()
            .connectTimeout(90, TimeUnit.SECONDS) // Thời gian chờ kết nối
            .readTimeout(90, TimeUnit.SECONDS)    // Thời gian chờ đọc dữ liệu
            .writeTimeout(90, TimeUnit.SECONDS)   // Thời gian chờ ghi dữ liệu
            .build();

    // Tạo instance Retrofit với OkHttpClient tùy chỉnh
    HairFastGanService hairFastGanService = new Retrofit.Builder()
            .baseUrl(AppConstant.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .client(okHttpClient) // Sử dụng OkHttpClient tùy chỉnh
            .build()
            .create(HairFastGanService.class);

    @Multipart
    @POST(AppConstant.GG_COLAB_URL+"/swap-hair")
    Call<ResponseBody> swapHair(
            @Part("hairStyleUrl") RequestBody hairStyleUrl,
            @Part("hairColorUrl") RequestBody hairColorUrl,
            @Part MultipartBody.Part image
    );
}
