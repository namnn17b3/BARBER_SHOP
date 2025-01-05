package com.example.barbershop.fragments;

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.UserService;
import com.example.barbershop.utils.AppUtils;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
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

public class LoginFragment extends Fragment {
    com.google.android.material.button.MaterialButton btnLogin;
    EditText emailEdt, passwordEdt;
    Gson gson = new Gson();
    CustomProgressDialog customProgressDialog;
    TextView registerTxt, forgotPasswordTxt;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        btnLogin = view.findViewById(R.id.btn_login);
        emailEdt = view.findViewById(R.id.email_edt);
        passwordEdt = view.findViewById(R.id.password_edt);
        registerTxt = view.findViewById(R.id.register_txt);
        forgotPasswordTxt = view.findViewById(R.id.forgot_password_txt);

        customProgressDialog = new CustomProgressDialog(this.getContext());
//        AppUtils.authenGlobal((MainActivity) getContext(), customProgressDialog);

        btnLogin.setOnClickListener(v -> {
            login();
        });

        registerTxt.setOnClickListener(v -> {
            RegisterFragment registerFragment = new RegisterFragment();
            ((MainActivity) getContext()).replaceFragment(registerFragment, "RegisterFragment");
        });

        forgotPasswordTxt.setOnClickListener(v -> {
            ForgotAndResetPasswordFragment forgotAndResetPasswordFragment = new ForgotAndResetPasswordFragment();
            ((MainActivity) getContext()).replaceFragment(forgotAndResetPasswordFragment, "ForgotAndResetPasswordFragment");
        });

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    private void login() {
        String email = emailEdt.getText().toString();
        String password = passwordEdt.getText().toString();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("email", email);
        map.put("password", password);
        String json = gson.toJson(map);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), json);

        customProgressDialog.show();
        UserService.userService.login(requestBody)
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
                                    AppUtils.show((Activity) LoginFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) LoginFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) LoginFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) LoginFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            AppUtils.saveDataToSharedPreferences("token", responseCommonDto.get("token").toString(), getContext());
                            AppUtils.saveDataToSharedPreferences("user", gson.toJson(responseCommonDto.get("user")), getContext());
                            Bundle bundle = new Bundle();
                            bundle.putBoolean("notifyScheduleFlag", true);
                            LoginFragment.this.getParentFragmentManager().setFragmentResult("notifySchedule", bundle);
                            ((MainActivity) getContext()).changeStateLoginOrInfo(false);
                            String itemNavMenu = AppUtils.getDataToSharedPreferences("navItem", getContext());
                            String fragmentName = AppUtils.getDataToSharedPreferences("preFragment", getContext());
                            if (itemNavMenu == null) {
                                itemNavMenu = "home";
                                fragmentName = "HomeFragment";
                            }
                            BottomNavigationView bottomNavigationView = ((MainActivity) getActivity()).getBottomNavigationView();
                            NavigationBarView.OnItemSelectedListener navigationItemListener = ((MainActivity) getActivity()).getNavigationItemListener();
                            bottomNavigationView.setOnItemSelectedListener(null);
                            ((MainActivity) getActivity()).setStatusClickItemMenuBottomNavigation(itemNavMenu);
                            bottomNavigationView.setOnItemSelectedListener(navigationItemListener);
                            LoginFragment.this.getActivity().getSupportFragmentManager().popBackStack(fragmentName, 0);
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) LoginFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) LoginFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }
}
