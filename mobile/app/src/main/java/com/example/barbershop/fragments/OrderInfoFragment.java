package com.example.barbershop.fragments;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.adapters.PaymentTypeSpinnerAdapter;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.OrderService;
import com.example.barbershop.utils.AppUtils;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.gson.Gson;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OrderInfoFragment extends Fragment {
    SwipeRefreshLayout swipeRefreshLayout;
    String date, time, paymentType, paymentUrl;
    int hairStyleId, hairColorId;
    Map<String, Object> orderInfo;
    Gson gson = new Gson();
    TextView barberNameTxt,
            usernameTxt, emailTxt, phoneTxt, addressTxt,
            hairStyleNameTxt, hairStylePriceTxt, hairStyleDiscountTxt,
            hairColorNameTxt, hairColorPriceTxt,
            amountTxt;
    ImageView barberImg;
    Spinner paymentTypeSpinner;
    Button btnBack, btnBackStep, btnPayment;
    CustomProgressDialog customProgressDialog;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_order_info, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        getOrderInfo();
                        paymentTypeSpinner.setSelection(0);
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        AppUtils.saveDataToSharedPreferences("preFragment", "OrderInfoFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "hair_style", getContext());

        AtomicReference<Bundle> bundle = new AtomicReference<>(getArguments());
        hairStyleId = bundle.get().getInt("hairStyleId");
        hairColorId = bundle.get().getInt("hairColorId");
        date = bundle.get().getString("date");
        time = bundle.get().getString("time");
        String orderInfoJson = bundle.get().getString("orderInfoJson");
        orderInfo = gson.fromJson(orderInfoJson, Map.class);

        barberImg = view.findViewById(R.id.barber_img);
        barberNameTxt = view.findViewById(R.id.barber_name_txt);
        usernameTxt = view.findViewById(R.id.username_txt);
        emailTxt = view.findViewById(R.id.email_txt);
        phoneTxt = view.findViewById(R.id.phone_txt);
        addressTxt = view.findViewById(R.id.address_txt);
        hairStyleNameTxt = view.findViewById(R.id.hair_style_name_txt);
        hairStylePriceTxt = view.findViewById(R.id.hair_style_price_txt);
        hairStyleDiscountTxt = view.findViewById(R.id.hair_style_discount_txt);
        hairColorNameTxt = view.findViewById(R.id.hair_color_name_txt);
        hairColorPriceTxt = view.findViewById(R.id.hair_color_price_txt);
        amountTxt = view.findViewById(R.id.amount_txt);

        bindingOrderInfoData();

        paymentTypeSpinner = view.findViewById(R.id.payment_type_spinner);
        List<String> paymentTypes = List.of("VNPAY", "MOMO");
        paymentTypeSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                paymentType = paymentTypes.get(i);
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        PaymentTypeSpinnerAdapter paymentTypeSpinnerAdapter = new PaymentTypeSpinnerAdapter(getContext(), paymentTypes);
        paymentTypeSpinner.setAdapter(paymentTypeSpinnerAdapter);

        btnBack = view.findViewById(R.id.btn_back);
        btnBackStep = view.findViewById(R.id.btn_back_step);

        btnBack.setOnClickListener(v -> {
            String itemNavMenu = "hair_style";
            String fragmentName = "ChooseDateAndTimeFragment";

            BottomNavigationView bottomNavigationView = ((MainActivity) getActivity()).getBottomNavigationView();
            NavigationBarView.OnItemSelectedListener navigationItemListener = ((MainActivity) getActivity()).getNavigationItemListener();
            bottomNavigationView.setOnItemSelectedListener(null);
            ((MainActivity) getActivity()).setStatusClickItemMenuBottomNavigation(itemNavMenu);
            bottomNavigationView.setOnItemSelectedListener(navigationItemListener);
            OrderInfoFragment.this.getActivity().getSupportFragmentManager().popBackStack(fragmentName, 0);
        });

        btnBackStep.setOnClickListener(v -> {
            String itemNavMenu = "hair_style";
            String fragmentName = "ChooseDateAndTimeFragment";

            BottomNavigationView bottomNavigationView = ((MainActivity) getActivity()).getBottomNavigationView();
            NavigationBarView.OnItemSelectedListener navigationItemListener = ((MainActivity) getActivity()).getNavigationItemListener();
            bottomNavigationView.setOnItemSelectedListener(null);
            ((MainActivity) getActivity()).setStatusClickItemMenuBottomNavigation(itemNavMenu);
            bottomNavigationView.setOnItemSelectedListener(navigationItemListener);
            OrderInfoFragment.this.getActivity().getSupportFragmentManager().popBackStack(fragmentName, 0);
        });

        btnPayment = view.findViewById(R.id.btn_payment);
        btnPayment.setOnClickListener(v -> {
            getPaymentUrl();
        });

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    private void getPaymentUrl() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("date", date);
        map.put("time", time);
        map.put("hairStyleId", hairStyleId);
        map.put("hairColorId", hairColorId);
        map.put("paymentType", paymentType);
        String json = gson.toJson(map);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), json);

        customProgressDialog.show();
        OrderService.orderService.getPaymentUrl(bearerToken, requestBody)
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
                                    AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }

                            Map<String, Object> data = (Map<String, Object>) responseCommonDto.get("data");
                            paymentUrl = data.get("paymentUrl").toString();
                            openBrowser();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void openBrowser() {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(paymentUrl));
        startActivity(intent);
    }

    private void getOrderInfo() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        customProgressDialog.show();
        OrderService.orderService.findOrderInfo(bearerToken, date, time, hairStyleId, hairColorId)
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
                                    AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            orderInfo = (Map<String, Object>) responseCommonDto.get("data");
                            bindingOrderInfoData();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) OrderInfoFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void bindingOrderInfoData() {
        Glide.with(getContext()).load(((Map<String, Object>) orderInfo.get("barber")).get("avatar").toString()).into(barberImg);
        barberNameTxt.setText(((Map<String, Object>) orderInfo.get("barber")).get("name").toString());
        usernameTxt.setText(((Map<String, Object>) orderInfo.get("user")).get("username").toString());
        emailTxt.setText(((Map<String, Object>) orderInfo.get("user")).get("email").toString());
        phoneTxt.setText(((Map<String, Object>) orderInfo.get("user")).get("phone").toString());
        addressTxt.setText(((Map<String, Object>) orderInfo.get("user")).get("address").toString());
        hairStyleNameTxt.setText(((Map<String, Object>) orderInfo.get("hairStyle")).get("name").toString());
        hairStylePriceTxt.setText(
            AppUtils.toVNNumberFormat(
                (int)(Double.parseDouble(((Map<String, Object>) orderInfo.get("hairStyle")).get("price").toString()))
        )+" đ");
        if (((Map<String, Object>) orderInfo.get("hairStyle")).get("discount") != null) {
            hairStyleDiscountTxt.setVisibility(View.VISIBLE);
            Map<String, Object> discount = (Map<String, Object>) ((Map<String, Object>) orderInfo.get("hairStyle")).get("discount");
            String unit = discount.get("unit").toString().equals("%") ? "%" : " đ";
            hairStyleDiscountTxt.setText(
                AppUtils.toVNNumberFormat(
                    (int)(Double.parseDouble(discount.get("value")+""))
            )+unit);
        } else {
            hairStyleDiscountTxt.setVisibility(View.GONE);
        }
        hairColorNameTxt.setText(AppUtils.capitalize(((Map<String, Object>) orderInfo.get("hairColor")).get("color").toString()));
        hairColorNameTxt.setTextColor(Color.parseColor(((Map<String, Object>) orderInfo.get("hairColor")).get("colorCode").toString()));
        hairColorPriceTxt.setText(
            AppUtils.toVNNumberFormat(
                (int)(Double.parseDouble(((Map<String, Object>) orderInfo.get("hairColor")).get("price").toString()))
        )+" đ");
        amountTxt.setText(
            AppUtils.toVNNumberFormat(
                (int)(Double.parseDouble((orderInfo.get("amount").toString())))
        )+" đ");
    }
}
