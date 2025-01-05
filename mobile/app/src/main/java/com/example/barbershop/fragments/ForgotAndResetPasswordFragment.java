package com.example.barbershop.fragments;

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.UserService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ForgotAndResetPasswordFragment extends Fragment {
    CustomProgressDialog customProgressDialog;
    Button btnSubmit;
    EditText emailEdt;
    Gson gson = new Gson();
    TextView loginTxt, formTitleTxt;
    String resetPasswordToken;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_forgot_and_reset_password, container, false);

        customProgressDialog = new CustomProgressDialog(this.getContext());

        AppUtils.saveDataToSharedPreferences("preFragment", "ForgotAndResetPasswordFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "login_or_info", getContext());

        emailEdt = view.findViewById(R.id.email_edt);

        btnSubmit = view.findViewById(R.id.btn_submit);
        btnSubmit.setOnClickListener(v -> {
            forgotPassword();
        });

        loginTxt = view.findViewById(R.id.login_txt);
        loginTxt.setOnClickListener(v -> {
            LoginFragment loginFragment = new LoginFragment();
            ((MainActivity) getContext()).replaceFragment(loginFragment, "LoginFragment");
        });

        formTitleTxt = view.findViewById(R.id.form_title_txt);

        resetForm();

        return view;
    }

    private void resetForm() {
        emailEdt.setText("");
    }

    private void forgotPassword() {
        String email = emailEdt.getText().toString();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("email", email);
        String json = gson.toJson(map);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), json);

        customProgressDialog.show();
        UserService.userService.forgotPassword(requestBody)
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
                                    AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }

                                responseCommonDto = gson.fromJson(json, Map.class);
                                if (statusCode == 401) {
                                    String message = responseCommonDto.get("message").toString();
                                    AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                    ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                    return;
                                }

                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, "Please check your email to reset your password!");
                        } catch (Exception e) {
                            if (customProgressDialog != null) customProgressDialog.close();
                            AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        if (customProgressDialog != null) customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) ForgotAndResetPasswordFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }
}
