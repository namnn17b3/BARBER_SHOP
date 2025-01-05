package com.example.barbershop.fragments;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.OrderService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.List;
import java.util.Map;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeFragment extends Fragment {
    WebView webView, ggMap;
    Button btnTryAINow;
    CustomProgressDialog customProgressDialog;
    Gson gson = new Gson();
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home, container, false);

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

        webView = view.findViewById(R.id.webview);
        String video = "<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/ovEo3CB_T8Q?si=cKX7RhAvPZXNgaLv\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>";
        webView.loadData(video, "text/html", "utf-8");
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());

        ggMap = view.findViewById(R.id.ggmap);
        String ggMapUrl = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d59604.67841314586!2d105.78741700000002!3d20.980913!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2sus!4v1734674312096!5m2!1svi!2sus\" width=\"100%\" height=\"100%\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>";
        ggMap.loadData(ggMapUrl, "text/html", "utf-8");
        ggMap.getSettings().setJavaScriptEnabled(true);
        ggMap.setWebChromeClient(new WebChromeClient());

        btnTryAINow = view.findViewById(R.id.try_ai_btn);
        btnTryAINow.setOnClickListener(v -> {
            ((MainActivity) HomeFragment.this.getContext()).replaceFragment(new HairFastGanFragment(), "HairFastGanFragment");
        });

        customProgressDialog = new CustomProgressDialog(this.getContext());

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        AppUtils.saveDataToSharedPreferences("preFragment", "HomeFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "home", getContext());

        AppUtils.authenGlobal((MainActivity) getContext(), customProgressDialog);

        getParentFragmentManager().setFragmentResultListener("notifySchedule", this, (requestKey, result) -> {
            if ("notifySchedule".equals(requestKey)) {
                boolean notifyScheduleFlag = result.getBoolean("notifyScheduleFlag");
                if (notifyScheduleFlag) notifySchedule();
            }
        });
    }

    private void notifySchedule() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;
        OrderService.orderService.getScheduleRecently(bearerToken)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        customProgressDialog.close();
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show((Activity) HomeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) HomeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) HomeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) HomeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            Map<String, Object> data = (Map<String, Object>) responseCommonDto.get("data");
                            if (data.get("schedule") != null) {
                                String schedule = data.get("schedule").toString();
                                String date = schedule.split(" ")[0];
                                String time = schedule.split(" ")[1];
                                String message = "You have a haircut scheduled for " + date + " at " + time + ". Come to the shop an hour in advance to prepare";
                                AppUtils.show((Activity) HomeFragment.this.getContext(), R.id.infoConstrainLayout, R.layout.info_dialog, R.id.infoDesc, R.id.infoDone, message);

                            }
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) HomeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) HomeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }
}
