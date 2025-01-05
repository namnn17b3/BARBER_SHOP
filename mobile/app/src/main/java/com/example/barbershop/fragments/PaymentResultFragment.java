package com.example.barbershop.fragments;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.PaymentService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PaymentResultFragment extends Fragment {
    CustomProgressDialog customProgressDialog;
    Gson gson = new Gson();
    int checkSum = -1;
    pl.droidsonroids.gif.GifImageView giftImageView;
    SwipeRefreshLayout swipeRefreshLayout;
    Map<String, String> paramMap = new LinkedHashMap<>();
    androidx.appcompat.widget.AppCompatButton btnBackToHome;
    Uri data;

    public PaymentResultFragment(Uri data) {
        this.data = data;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_payment_result, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        verify();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        AppUtils.saveDataToSharedPreferences("preFragment", "PaymentResultFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "hair_style", getContext());

        giftImageView = view.findViewById(R.id.gift_image_view);

        btnBackToHome = view.findViewById(R.id.btn_back_to_home);
        btnBackToHome.setOnClickListener(v -> {
            ((MainActivity) getActivity()).setStatusClickItemMenuBottomNavigation("home");
        });

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        handlePaymentResult();
    }

    private void verify() {
        customProgressDialog.show();
        PaymentService.paymentService.verify(paramMap)
                .enqueue(new Callback<Map<String, Object>>() {
                    @Override
                    public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                        customProgressDialog.close();
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show((Activity) PaymentResultFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) PaymentResultFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                AppUtils.show((Activity) PaymentResultFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Something went wrong!");
                                giftImageView.setImageResource(R.drawable.payment_no_data);
                                return;
                            }
                            responseCommonDto = response.body();
                            Map<String, Object> map = (Map<String, Object>) responseCommonDto.get("data");
                            checkSum = (int) (Double.parseDouble(map.get("checksum")+""));
                            renderUI();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) PaymentResultFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        customProgressDialog.close();
                        AppUtils.show((Activity) PaymentResultFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    public void handlePaymentResult() {
        if (paramMap.size() == 0) {
            Set<String> parameterNames = data.getQueryParameterNames();
            for (String key : parameterNames) {
                paramMap.put(key, data.getQueryParameter(key));
            }
        }

        verify();
    }

    private void renderUI() {
        if (checkSum == 1) {
            AppUtils.show((Activity) PaymentResultFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, "Payment successful, please check the information in the email");
            giftImageView.setImageResource(R.drawable.payment_result_thank_you);
        } else if (checkSum == 0) {
            AppUtils.show((Activity) PaymentResultFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Checksum Failed!");
            giftImageView.setImageResource(R.drawable.payment_no_data);
        } else {
            AppUtils.show((Activity) PaymentResultFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Payment Failed!");
            giftImageView.setImageResource(R.drawable.payment_result_error);
        }
    }
}
