package com.example.barbershop.fragments;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.BarberService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BarberDetailFragment extends Fragment {
    private int barberId;

    CustomProgressDialog customProgressDialog;
    Gson gson = new Gson();
    ImageView barberImage;
    TextView barberName, barberAge, barberGender, barberDescription;
    Map<String, Object> barber;
    Button btnBack;
    SwipeRefreshLayout swipeRefreshLayout;

    public BarberDetailFragment(int barberId) {
        this.barberId = barberId;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_barber_detail, container, false);
    }

    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        getBarberDetail();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "BarberDetailFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "barber", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        barberName = view.findViewById(R.id.barber_name);
        barberImage = view.findViewById(R.id.barber_img);
        barberGender = view.findViewById(R.id.barber_gender);
        barberAge = view.findViewById(R.id.barber_age);
        barberDescription = view.findViewById(R.id.barber_description);
        btnBack = view.findViewById(R.id.btn_back);

        btnBack.setOnClickListener(v -> {
            MainActivity mainActivity = (MainActivity) BarberDetailFragment.this.getContext();
            mainActivity.getSupportFragmentManager().popBackStack();
        });

        getBarberDetail();
    }

    private void getBarberDetail() {
        customProgressDialog.show();
        BarberService.barberService.getBarberDetail(barberId)
                .enqueue(new Callback<Map<String, Object>>() {
                    @Override
                    public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                        customProgressDialog.close();
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show((Activity) BarberDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) BarberDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) BarberDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            barber = (Map<String, Object>) responseCommonDto.get("data");
                            updateUI();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) BarberDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        customProgressDialog.close();
                        AppUtils.show((Activity) BarberDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void updateUI() {
        Glide.with(getContext()).load(barber.get("img").toString()).into(barberImage);
        barberName.setText(barber.get("name").toString());
        barberAge.setText("Age: "+((int) Double.parseDouble(barber.get("age").toString())));
        barberGender.setText("Gender: "+AppUtils.capitalize(barber.get("gender").toString()));
        barberDescription.setText(barber.get("description").toString());
    }
}
