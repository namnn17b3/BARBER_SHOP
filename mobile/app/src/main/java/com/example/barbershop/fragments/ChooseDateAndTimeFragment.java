package com.example.barbershop.fragments;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.NumberPicker;
import android.widget.Spinner;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.adapters.ColorSpinnerAdapter;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.HairColorService;
import com.example.barbershop.services.OrderService;
import com.example.barbershop.utils.AppUtils;
import com.google.android.material.datepicker.MaterialDatePicker;
import com.google.gson.Gson;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChooseDateAndTimeFragment extends Fragment {
    NumberPicker hourPicker, minutePicker;
    Button btnNextStep, btnChooseDate, btnBack;
    SwipeRefreshLayout swipeRefreshLayout;
    CustomProgressDialog customProgressDialog;
    Spinner colorSpinner;
    List<Map<String, Object>> colors = new ArrayList<>();
    Gson gson = new Gson();
    ColorSpinnerAdapter colorSpinnerAdapter;
    MaterialDatePicker<Long> materialDatePicker;
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    String date, time;
    int hairStyleId, hairColorId;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_choose_date_and_time, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        getColors();
                        hourPicker.setValue(8);
                        minutePicker.setValue(0);
                        date = simpleDateFormat.format(new Date(System.currentTimeMillis()));
                        btnChooseDate.setText(date);
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "ChooseDateAndTimeFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "hair_style", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        time = "08:00";

        hourPicker = view.findViewById(R.id.hour_picker);
        hourPicker.setMinValue(8); // Bắt đầu từ 8h
        hourPicker.setMaxValue(20); // Kết thúc tại 20h
        hourPicker.setDisplayedValues(new String[]{"08", "09", "10", "11", "12", "13", "14", "15",
                "16", "17", "18", "19", "20"});

        // Khởi tạo NumberPicker cho phút
        minutePicker = view.findViewById(R.id.minute_picker);
        minutePicker.setMinValue(0); // Bắt đầu từ phút 0
        minutePicker.setMaxValue(1); // Chỉ có 0 hoặc 30
        minutePicker.setDisplayedValues(new String[]{"00", "30"});

        AtomicReference<Bundle> bundle = new AtomicReference<>(getArguments());
        hairStyleId = bundle.get().getInt("hairStyleId");

        btnNextStep = view.findViewById(R.id.btn_next_step);
        // Xử lý khi giá trị thay đổi
        btnNextStep.setOnClickListener(v -> {
            int selectedHour = hourPicker.getValue();
            int selectedMinute = minutePicker.getValue() * 30;
            time = String.format("%02d:%02d", selectedHour, selectedMinute);
            getOrderInfo();
        });

        btnChooseDate = view.findViewById(R.id.btn_choose_date);
        date = simpleDateFormat.format(new Date(System.currentTimeMillis()));
        btnChooseDate.setText(date);
        btnChooseDate.setOnClickListener(v -> {
            long dateTime = System.currentTimeMillis();
            if (date != null) {
                try {
                    dateTime = AppUtils.getDateInstanceWithTimezone(simpleDateFormat.parse(date), "Asia/Ho_Chi_Minh").getTime();
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
            }
            date = simpleDateFormat.format(new Date(dateTime));
            btnChooseDate.setText(date);
            materialDatePicker = MaterialDatePicker.Builder.datePicker()
                    .setTitleText("Select start date")
                    .setSelection(dateTime)
                    .build();
            materialDatePicker.addOnPositiveButtonClickListener(selection -> {
                date = simpleDateFormat.format(new Date(selection));
                btnChooseDate.setText(date);
            });
            materialDatePicker.show(getActivity().getSupportFragmentManager(), "tag");
        });

        btnBack = view.findViewById(R.id.btn_back);
        btnBack.setOnClickListener(v -> {
            MainActivity mainActivity = (MainActivity) ChooseDateAndTimeFragment.this.getContext();
            mainActivity.getSupportFragmentManager().popBackStack();
        });

        colorSpinner = view.findViewById(R.id.color_spinner);
        colorSpinnerAdapter = new ColorSpinnerAdapter(getContext(), colors);
        colorSpinner.setAdapter(colorSpinnerAdapter);

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        getColors();
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
                                    AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            Map<String, Object> data = (Map<String, Object>) responseCommonDto.get("data");
                            Bundle bundle = new Bundle();
                            OrderInfoFragment orderInfoFragment = new OrderInfoFragment();
                            bundle.putString("orderInfoJson", gson.toJson(data));
                            bundle.putString("date", date);
                            bundle.putString("time", time);
                            bundle.putInt("hairStyleId", hairStyleId);
                            bundle.putInt("hairColorId", hairColorId);
                            orderInfoFragment.setArguments(bundle);
                            ((MainActivity) getContext()).replaceFragment(orderInfoFragment, "OrderInfoFragment");
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void getColors() {
        colors.clear();

        customProgressDialog.show();
        HairColorService.hairColorService.getListHairColor()
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
                                    AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            List<Map<String, Object>> tmp = (List<Map<String, Object>>) responseCommonDto.get("data");
                            colors.addAll(tmp);
                            colorSpinnerAdapter.notifyDataSetChanged();
                            if (colors.size() > 0) colorSpinner.setSelection(0);
                            colorSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                                @Override
                                public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                                    hairColorId = (int) (Double.parseDouble(colors.get(i).get("id")+""));
                                }

                                @Override
                                public void onNothingSelected(AdapterView<?> adapterView) {

                                }
                            });
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) ChooseDateAndTimeFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }
}
