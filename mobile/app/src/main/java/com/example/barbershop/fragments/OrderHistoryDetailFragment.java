package com.example.barbershop.fragments;

import androidx.core.view.GravityCompat;
import androidx.fragment.app.Fragment;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.FeedbackService;
import com.example.barbershop.services.OrderService;
import com.example.barbershop.utils.AppUtils;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.gson.Gson;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OrderHistoryDetailFragment extends Fragment {
    SwipeRefreshLayout swipeRefreshLayout;
    Map<String, Object> orderDetail;
    Gson gson = new Gson();
    TextView barberNameTxt,
            usernameTxt, emailTxt, phoneTxt, addressTxt,
            hairStyleNameTxt, hairStylePriceTxt, hairStyleDiscountTxt,
            hairColorNameTxt, hairColorPriceTxt,
            orderCodeTxt, orderTimeTxt, scheduleTxt, cuttedTxt, amountTxt, statusTxt, bankCodeTxt, bankTranNoTxt, paymentTypeTxt;
    ImageView barberImg;
    Button btnBack, btnCancelOrder, btnSubmit, btnDelete;
    CustomProgressDialog customProgressDialog;
    private int orderId;
    androidx.cardview.widget.CardView noteCancelOrder, noteReviewOrder;
    AlertDialog alertDialog;
    LinearLayout reviewLLWrap, reviewBtnWrapLL;
    Map<String, Object> feedback;
    TextView reviewedAtTxt;
    EditText commentEdt;
    RatingBar reviewStar;
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    boolean isCreateNewFeedback = true;

    public OrderHistoryDetailFragment(int orderId) {
        this.orderId = orderId;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_order_history_detail, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        getOrderDetail();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        AppUtils.saveDataToSharedPreferences("preFragment", "OrderInfoFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "hair_style", getContext());

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
        orderCodeTxt = view.findViewById(R.id.order_code_txt);
        orderTimeTxt = view.findViewById(R.id.order_time_txt);
        scheduleTxt = view.findViewById(R.id.schedule_txt);
        cuttedTxt = view.findViewById(R.id.cutted_txt);
        amountTxt = view.findViewById(R.id.amount_txt);
        statusTxt = view.findViewById(R.id.status_txt);
        bankCodeTxt = view.findViewById(R.id.bank_code_txt);
        bankTranNoTxt = view.findViewById(R.id.bank_tran_no_txt);
        paymentTypeTxt = view.findViewById(R.id.payment_type_txt);

        btnBack = view.findViewById(R.id.btn_back);

        btnBack.setOnClickListener(v -> {
            String itemNavMenu = "login_or_info";
            String fragmentName = "OrderHistoryFragment";

            BottomNavigationView bottomNavigationView = ((MainActivity) getActivity()).getBottomNavigationView();
            NavigationBarView.OnItemSelectedListener navigationItemListener = ((MainActivity) getActivity()).getNavigationItemListener();
            bottomNavigationView.setOnItemSelectedListener(null);
            ((MainActivity) getActivity()).setStatusClickItemMenuBottomNavigation(itemNavMenu);
            bottomNavigationView.setOnItemSelectedListener(navigationItemListener);
            OrderHistoryDetailFragment.this.getActivity().getSupportFragmentManager().popBackStack(fragmentName, 0);
        });

        btnCancelOrder = view.findViewById(R.id.btn_cancel_order);
        noteCancelOrder = view.findViewById(R.id.note_cancel_order);
        noteReviewOrder = view.findViewById(R.id.note_review_order);
        btnCancelOrder.setOnClickListener(v -> {
            alertDialog = AppUtils.showOptionDialog(
                (Activity) OrderHistoryDetailFragment.this.getContext(),
                "Are you sure?",
                "You won't be able to revert this!",
                "Yes, cancel it!",
                "No, thanks!",
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        alertDialog.dismiss();
                        cancelOrder();
                    }
                },
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        alertDialog.dismiss();
                    }
                }
            );
        });

        reviewLLWrap = view.findViewById(R.id.review_ll_wrap);
        reviewBtnWrapLL = view.findViewById(R.id.review_btn_wrap_ll);
        reviewedAtTxt = view.findViewById(R.id.reviewed_at_txt);
        commentEdt = view.findViewById(R.id.comment_edt);
        reviewStar = view.findViewById(R.id.review_star);

        btnSubmit = view.findViewById(R.id.btn_submit);
        btnSubmit.setOnClickListener(v -> {
            submitFormFeedback();
        });

        btnDelete = view.findViewById(R.id.btn_delete);
        btnDelete.setOnClickListener(v -> {
            alertDialog = AppUtils.showOptionDialog(
                    (Activity) OrderHistoryDetailFragment.this.getContext(),
                    "Are you sure?",
                    "You won't be able to revert this!",
                    "Yes, delete it!",
                    "No, thanks!",
                    new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            alertDialog.dismiss();
                            deleteFeedback();
                        }
                    },
                    new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            alertDialog.dismiss();
                        }
                    }
            );
        });

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        getOrderDetail();
    }

    private void getOrderDetail() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        customProgressDialog.show();
        OrderService.orderService.getOrderDetail(bearerToken, orderId)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            orderDetail = (Map<String, Object>) responseCommonDto.get("data");
                            bindingOrderInfoData();
                            getFeedbackByUserAndOrder();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void bindingOrderInfoData() {
        Glide.with(getContext()).load(((Map<String, Object>) orderDetail.get("barber")).get("avatar").toString()).into(barberImg);
        barberNameTxt.setText(((Map<String, Object>) orderDetail.get("barber")).get("name").toString());
        usernameTxt.setText(((Map<String, Object>) orderDetail.get("user")).get("username").toString());
        emailTxt.setText(((Map<String, Object>) orderDetail.get("user")).get("email").toString());
        phoneTxt.setText(((Map<String, Object>) orderDetail.get("user")).get("phone").toString());
        addressTxt.setText(((Map<String, Object>) orderDetail.get("user")).get("address").toString());
        hairStyleNameTxt.setText(((Map<String, Object>) orderDetail.get("hairStyle")).get("name").toString());
        hairStylePriceTxt.setText(
                AppUtils.toVNNumberFormat(
                        (int)(Double.parseDouble(((Map<String, Object>) orderDetail.get("hairStyle")).get("price").toString()))
                )+" đ");
        if (((Map<String, Object>) orderDetail.get("hairStyle")).get("discount") != null) {
            hairStyleDiscountTxt.setVisibility(View.VISIBLE);
            Map<String, Object> discount = (Map<String, Object>) ((Map<String, Object>) orderDetail.get("hairStyle")).get("discount");
            String unit = discount.get("unit").toString().equals("%") ? "%" : " đ";
            hairStyleDiscountTxt.setText(
                    AppUtils.toVNNumberFormat(
                            (int)(Double.parseDouble(discount.get("value")+""))
                    )+unit);
        } else {
            hairStyleDiscountTxt.setVisibility(View.GONE);
        }
        hairColorNameTxt.setText(AppUtils.capitalize(((Map<String, Object>) orderDetail.get("hairColor")).get("color").toString()));
        hairColorNameTxt.setTextColor(Color.parseColor(((Map<String, Object>) orderDetail.get("hairColor")).get("colorCode").toString()));
        hairColorPriceTxt.setText(
                AppUtils.toVNNumberFormat(
                        (int)(Double.parseDouble(((Map<String, Object>) orderDetail.get("hairColor")).get("price").toString()))
                )+" đ");
        orderCodeTxt.setText("BBSOD"+(int)(Double.parseDouble((orderDetail.get("id").toString()))));
        orderTimeTxt.setText(orderDetail.get("orderTime").toString());
        scheduleTxt.setText(orderDetail.get("schedule").toString());
        boolean cutted = (boolean) orderDetail.get("cutted");
        if (cutted) {
            cuttedTxt.setText("Yes");
        } else {
            cuttedTxt.setText("No");
        }
        amountTxt.setText(
                AppUtils.toVNNumberFormat(
                        (int)(Double.parseDouble((orderDetail.get("amount").toString())))
                )+" đ");
        String status = orderDetail.get("status").toString();
        statusTxt.setText(status);
        if (status.equals("Success")) {
            statusTxt.setTextColor(Color.parseColor("#28a745"));
        } else {
            statusTxt.setTextColor(Color.parseColor("#dc3545"));
        }
        bankCodeTxt.setText(orderDetail.get("bankCode").toString());
        bankTranNoTxt.setText(orderDetail.get("bankTranNo").toString());
        paymentTypeTxt.setText(orderDetail.get("paymentType").toString());
        if (!cutted && status.equals("Success")) {
            btnCancelOrder.setVisibility(View.VISIBLE);
            noteCancelOrder.setVisibility(View.VISIBLE);
        } else {
            btnCancelOrder.setVisibility(View.GONE);
            noteCancelOrder.setVisibility(View.GONE);

            noteReviewOrder.setVisibility(View.VISIBLE);
            reviewLLWrap.setVisibility(View.VISIBLE);
        }
    }

    private void cancelOrder() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        customProgressDialog.show();
        OrderService.orderService.cancelOrder(bearerToken, "application/json", orderId)
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
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, "Canceled order successfully!");
                            btnCancelOrder.setVisibility(View.GONE);
                            noteCancelOrder.setVisibility(View.GONE);
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void getFeedbackByUserAndOrder() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        FeedbackService.feedbackService.getFeedbackByUserAndOrder(bearerToken, orderId)
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
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                if (statusCode == 401) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Session expire!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            feedback = (Map<String, Object>) responseCommonDto.get("data");
                            renderFeedback();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void renderFeedback() {
        if (feedback == null) {
            btnDelete.setVisibility(View.GONE);
            reviewedAtTxt.setVisibility(View.GONE);
            commentEdt.setText("");
            reviewStar.setRating(1);
            isCreateNewFeedback = true;
        } else {
            btnDelete.setVisibility(View.VISIBLE);
            reviewedAtTxt.setVisibility(View.VISIBLE);
            reviewedAtTxt.setText("Reviewed at: "+feedback.get("time").toString());
            commentEdt.setText(feedback.get("comment").toString());
            reviewStar.setRating(Float.parseFloat(feedback.get("star").toString()));
            isCreateNewFeedback = false;
        }

        String schedule = orderDetail.get("schedule").toString()+":00";
        try {
            Date scheduleDate = AppUtils.getDateInstanceWithTimezone(simpleDateFormat.parse(schedule), "Asia/Ho_Chi_Minh");
            long now = System.currentTimeMillis();
            if (now - scheduleDate.getTime() >= 0 && now - scheduleDate.getTime() <= 3*24*60*60*1000) {
                reviewBtnWrapLL.setVisibility(View.VISIBLE);
                commentEdt.setFocusable(true);
                commentEdt.setCursorVisible(true);
                commentEdt.setLongClickable(true);
                reviewStar.setIsIndicator(false);
            } else {
                reviewBtnWrapLL.setVisibility(View.GONE);
                commentEdt.setFocusable(false);
                commentEdt.setCursorVisible(false);
                commentEdt.setLongClickable(false);
                reviewStar.setIsIndicator(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    private void submitFormFeedback() {
        if (isCreateNewFeedback) {
            createNewFeedback();
        } else {
            updateFeedback();
        }
    }

    private void createNewFeedback() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("comment", commentEdt.getText().toString());
        map.put("star", reviewStar.getRating());
        map.put("orderId", orderId);
        String json = gson.toJson(map);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), json);

        customProgressDialog.show();
        FeedbackService.feedbackService.createNewFeedback(bearerToken, requestBody)
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
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                if (statusCode == 401) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Session expire!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            feedback = (Map<String, Object>) ((Map<String, Object>) responseCommonDto.get("data")).get("feedback");
                            String message = ((Map<String, Object>) responseCommonDto.get("data")).get("message")+"";
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, message);
                            renderFeedback();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void updateFeedback() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        int feedbackId = (int) Float.parseFloat(feedback.get("id")+"");
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("comment", commentEdt.getText().toString());
        map.put("star", reviewStar.getRating());
        String json = gson.toJson(map);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), json);

        customProgressDialog.show();
        FeedbackService.feedbackService.updateFeedback(bearerToken, feedbackId, requestBody)
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
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                if (statusCode == 401) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Session expire!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            feedback = (Map<String, Object>) ((Map<String, Object>) responseCommonDto.get("data")).get("feedback");
                            String message = ((Map<String, Object>) responseCommonDto.get("data")).get("message")+"";
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, message);
                            renderFeedback();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void deleteFeedback() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        int feedbackId = (int) Float.parseFloat(feedback.get("id")+"");
        customProgressDialog.show();
        FeedbackService.feedbackService.deleteFeedback(bearerToken, "application/json", feedbackId)
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
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                if (statusCode == 401) {
                                    AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Session expire!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            feedback = null;
                            String message = responseCommonDto.get("data").toString();
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, message);
                            renderFeedback();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) OrderHistoryDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }
}
