package com.example.barbershop.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.UserService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.List;
import java.util.Map;

import im.crisp.client.external.Crisp;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class InfoFragment extends Fragment {
    androidx.appcompat.widget.AppCompatButton btnChatWithShop, btnHistoryOrder, btnProfile;
    Map<String, Object> user;
    Gson gson = new Gson();
    CustomProgressDialog customProgressDialog;
    Button btnLogout;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_info, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        customProgressDialog = new CustomProgressDialog(this.getContext());

        btnChatWithShop = view.findViewById(R.id.btn_chat_with_shop);
        btnChatWithShop.setOnClickListener(v -> {
            Intent crispIntent = ((MainActivity) getContext()).getCrispIntent();
            startActivity(crispIntent);
        });

        String userJson = AppUtils.getDataToSharedPreferences("user", getContext());
        user = (Map<String, Object>) gson.fromJson(userJson, Map.class);

        if (user.get("role").toString().equalsIgnoreCase("USER")) {
            btnChatWithShop.setVisibility(View.VISIBLE);
        }

        btnLogout = view.findViewById(R.id.btn_logout);
        btnLogout.setOnClickListener(v -> {
            logout();
        });

        btnHistoryOrder = view.findViewById(R.id.btn_history_order);
        btnHistoryOrder.setOnClickListener(v -> {
            OrderHistoryFragment orderHistoryFragment = new OrderHistoryFragment();
            ((MainActivity) getContext()).replaceFragment(orderHistoryFragment, "OrderHistoryFragment");
        });

        btnProfile = view.findViewById(R.id.btn_profile);
        btnProfile.setOnClickListener(v -> {
            ProfileFragment profileFragment = new ProfileFragment();
            ((MainActivity) getContext()).replaceFragment(profileFragment, "ProfileFragment");
        });

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        AppUtils.authenGlobal((MainActivity) getContext(), customProgressDialog);
    }

    private void logout() {
        MainActivity mainActivity = (MainActivity) getContext();
        String tokenEncodeURIComponent = AppUtils.getDataToSharedPreferences("token", mainActivity);
        customProgressDialog.show();

        UserService.userService.logout(tokenEncodeURIComponent)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        if (customProgressDialog != null) customProgressDialog.close();
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) { // OK
                                mainActivity.changeStateLoginOrInfo(true);
                                AppUtils.removeDataToSharedPreferences("token", getContext());
                                AppUtils.removeDataToSharedPreferences("user", getContext());
                                return;
                            }
                            mainActivity.changeStateLoginOrInfo(false);
                            mainActivity.setStatusClickItemMenuBottomNavigation("home");
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }
}
