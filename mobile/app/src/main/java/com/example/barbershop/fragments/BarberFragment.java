package com.example.barbershop.fragments;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.SearchView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.adapters.BarberAdapter;
import com.example.barbershop.constant.AppConstant;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.BarberService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BarberFragment extends Fragment {

    CustomProgressDialog customProgressDialog;
    RecyclerView rcvListBarber;
    BarberAdapter barberAdapter;
    List<Map<String, Object>> listBarberResponse = new ArrayList<>();
    Intent intent;
    Gson gson = new Gson();
    int barberId = 0;
    Button btnMenu;
    String name, ageMin, ageMax, gender, page = "1", items = AppConstant.ITEM_IN_PAGE+"";
    Map<String, Object> meta;
    PopupMenu popupMenu;
    Button btnFilter, btnCloseFilter, btnApplyFilter;
    DrawerLayout drawerLayout;
    SearchView barberNameSv;
    EditText minAgeEdt, maxAgeEdt;
    RadioGroup genderRadioGroup;
    RadioButton maleGenderRadioBtn, femaleGenderRadioBtn, allGenderRadioBtn;
    LinearLayout noResult;
    TextView pageTxt;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) { // chay 1 lan duy nhat khi new fragment
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_barber, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) { // chay khi view duoc ve len UI
        super.onViewCreated(view, savedInstanceState);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        getListBarber();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "BarberFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "barber", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        btnMenu = view.findViewById(R.id.pagination_menu);
        btnFilter = view.findViewById(R.id.btn_filter);
        btnCloseFilter = view.findViewById(R.id.btn_color_filter);

        barberNameSv = view.findViewById(R.id.barber_name_sv);
        minAgeEdt = view.findViewById(R.id.min_age_edt);
        maxAgeEdt = view.findViewById(R.id.max_age_edt);
        genderRadioGroup = view.findViewById(R.id.gender_radio_group);
        maleGenderRadioBtn = view.findViewById(R.id.gender_male_radio_btn);
        femaleGenderRadioBtn = view.findViewById(R.id.gender_female_radio_btn);
        allGenderRadioBtn = view.findViewById(R.id.gender_all_radio_btn);
        noResult = view.findViewById(R.id.no_result);
        pageTxt = view.findViewById(R.id.page_txt);

        btnApplyFilter = view.findViewById(R.id.btn_apply_filter);

        drawerLayout = getActivity().findViewById(R.id.drawer_layout);

        btnFilter.setOnClickListener(v -> {
            if (drawerLayout != null && !drawerLayout.isDrawerOpen(GravityCompat.START)) {
                drawerLayout.openDrawer(GravityCompat.START); // Mở Navigation Drawer
            }
        });

        btnCloseFilter.setOnClickListener(v -> {
            if (drawerLayout != null && drawerLayout.isDrawerOpen(GravityCompat.START)) {
                drawerLayout.closeDrawer(GravityCompat.START); // Mở Navigation Drawer
            }
        });

        btnApplyFilter.setOnClickListener(v -> {
            getFilterQuery();
            getListBarber();
        });

        rcvListBarber = view.findViewById(R.id.list_barber);
        barberAdapter = new BarberAdapter(getContext(), listBarberResponse);
        rcvListBarber.setLayoutManager(new GridLayoutManager(getContext(), 2));
        rcvListBarber.setAdapter(barberAdapter);
        barberAdapter.setItemClickListener((View itemView, int position) -> {
            barberId = (int) Double.parseDouble(listBarberResponse.get(position).get("id")+"");
            MainActivity mainActivity = (MainActivity) BarberFragment.this.getContext();
            mainActivity.replaceFragment(new BarberDetailFragment(barberId), "BarberDetailFragment");
        });

        btnMenu.setOnClickListener(v -> {
            popupMenu.show();
        });

        getListBarber();
    }

    private void getFilterQuery() {
        page = "1";
        name = String.valueOf(barberNameSv.getQuery());
        ageMin = minAgeEdt.getText().toString();
        ageMax = maxAgeEdt.getText().toString();
        if (name.equals("")) {
            name = null;
        }

        int genderSelectedRadioId = genderRadioGroup.getCheckedRadioButtonId();
        if (genderSelectedRadioId == R.id.gender_male_radio_btn) {
            gender = "MALE";
        } else if (genderSelectedRadioId == R.id.gender_female_radio_btn) {
            gender = "FEMALE";
        } else if (genderSelectedRadioId == R.id.gender_all_radio_btn) {
            gender = null;
        }
    }

    private void getListBarber() {
        listBarberResponse.clear();
        barberAdapter.notifyDataSetChanged();

        customProgressDialog.show();
        BarberService.barberService.getListBarber(name, ageMin, ageMax, gender, page, items)
            .enqueue(new Callback<Map<String, Object>>() {
                @Override
                public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                    customProgressDialog.close();
                    pageTxt.setText("page "+page);
                    try {
                        Map<String, Object> responseCommonDto;
                        if (!response.isSuccessful()) {
                            String json = response.errorBody().string();
                            int statusCode = response.code();
                            if (statusCode == 500) {
                                AppUtils.show((Activity) BarberFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                return;
                            }
                            if (statusCode == 404) {
                                AppUtils.show((Activity) BarberFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                return;
                            }
                            responseCommonDto = gson.fromJson(json, Map.class);
                            String message = "";
                            List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                            for (Map<String, Object> error : errors) {
                                message = message + error.get("message").toString()+"\n";
                            }
                            AppUtils.show((Activity) BarberFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                            return;
                        }
                        responseCommonDto = response.body();
                        listBarberResponse.clear();
                        List<Map<String, Object>> tmp = (List<Map<String, Object>>) responseCommonDto.get("data");
                        meta = (Map<String, Object>) responseCommonDto.get("meta");
                        popupMenu = AppUtils.renderPagination(btnMenu, btnMenu, meta);
                        pagination();
                        for (Map<String, Object> barberMap : tmp) {
                            listBarberResponse.add(barberMap);
                        }
                        if (tmp.size() == 0) {
                            noResult.setVisibility(View.VISIBLE);
                            pageTxt.setVisibility(View.GONE);
                        } else {
                            noResult.setVisibility(View.GONE);
                            pageTxt.setVisibility(View.VISIBLE);
                        }
                        if (drawerLayout != null && drawerLayout.isDrawerOpen(GravityCompat.START)) {
                            drawerLayout.closeDrawer(GravityCompat.START); // Mở Navigation Drawer
                        }
                        barberAdapter.notifyDataSetChanged();
                    } catch (Exception e) {
                        customProgressDialog.close();
                        AppUtils.show((Activity) BarberFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                    t.printStackTrace();
                    customProgressDialog.close();
                    AppUtils.show((Activity) BarberFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                }
            });
    }

    private void pagination() {
        if (popupMenu == null) return;
        popupMenu.setOnMenuItemClickListener(itemMenu -> {
            handleMenuItemClick(itemMenu);
            return false;
        });
    }

    private void handleMenuItemClick(MenuItem itemMenu) {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        }
        page = itemMenu.getItemId()+"";
        getListBarber();
    }
}