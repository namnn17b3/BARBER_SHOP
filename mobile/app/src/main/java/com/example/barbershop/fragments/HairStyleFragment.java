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
import com.example.barbershop.adapters.HairStyleAdapter;
import com.example.barbershop.constant.AppConstant;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.BarberService;
import com.example.barbershop.services.HairStyleService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HairStyleFragment extends Fragment {

    CustomProgressDialog customProgressDialog;
    RecyclerView rcvListHairStyle;
    HairStyleAdapter hairStyleAdapter;
    List<Map<String, Object>> listHairStyleResponse = new ArrayList<>();
    Gson gson = new Gson();
    int hairStyleId = 0;
    Button btnMenu, btnBooking;
    String name, priceMin, priceMax, sorting, rating, booking, priority, page = "1", items = AppConstant.ITEM_IN_PAGE+"";
    Map<String, Object> meta;
    PopupMenu popupMenu;
    Button btnFilter, btnCloseFilter, btnApplyFilter;
    DrawerLayout drawerLayout;
    SearchView hairStyleNameSv;
    EditText minPriceEdt, maxPriceEdt;
    RadioGroup ratingRadioGroup, bookingRadioGroup, priorityRadioGroup;
    LinearLayout noResult;
    TextView pageTxt;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) { // chay 1 lan duy nhat khi new fragment
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_hair_style, container, false);
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
                        getListHairStyle();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "HairStyleFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "hair_style", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        btnMenu = view.findViewById(R.id.pagination_menu);
        btnFilter = view.findViewById(R.id.btn_filter);
        btnCloseFilter = view.findViewById(R.id.btn_color_filter);

        hairStyleNameSv = view.findViewById(R.id.hair_style_name_sv);
        minPriceEdt = view.findViewById(R.id.min_price_edt);
        maxPriceEdt = view.findViewById(R.id.max_price_edt);
        ratingRadioGroup = view.findViewById(R.id.rating_radio_group);
        bookingRadioGroup = view.findViewById(R.id.booking_radio_group);
        priorityRadioGroup = view.findViewById(R.id.priority_radio_group);
        noResult = view.findViewById(R.id.no_result);
        pageTxt = view.findViewById(R.id.page_txt);

        btnApplyFilter = view.findViewById(R.id.btn_apply_filter);

        drawerLayout = view.findViewById(R.id.drawer_layout);

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
            getListHairStyle();
        });

        rcvListHairStyle = view.findViewById(R.id.list_hair_style);
        hairStyleAdapter = new HairStyleAdapter(getContext(), listHairStyleResponse);
        rcvListHairStyle.setLayoutManager(new GridLayoutManager(getContext(), 1));
        rcvListHairStyle.setAdapter(hairStyleAdapter);
        hairStyleAdapter.setItemClickListener((View itemView, int position) -> {
            hairStyleId = (int) Double.parseDouble(listHairStyleResponse.get(position).get("id")+"");
            MainActivity mainActivity = (MainActivity) HairStyleFragment.this.getContext();
            mainActivity.replaceFragment(new HairStyleDetailFragment(hairStyleId), "HairStyleDetailFragment");
        });

        btnMenu.setOnClickListener(v -> {
            popupMenu.show();
        });

        btnBooking = view.findViewById(R.id.btn_booking);

        getListHairStyle();
    }

    private void getFilterQuery() {
        page = "1";
        name = String.valueOf(hairStyleNameSv.getQuery());
        priceMin = minPriceEdt.getText().toString();
        priceMax = maxPriceEdt.getText().toString();
        if (name.equals("")) {
            name = null;
        }

        Map<Integer, String> map1 = Map.of(0, "asc", 1, "desc", 2, "none");
        Map<Integer, String> map2 = Map.of(0, "rating", 1, "booking", 2, "none");

        // rating
        for (int i = 0; i < 3; i++) {
            RadioButton radioButton = (RadioButton) ratingRadioGroup.getChildAt(i);
            if (radioButton.getId() == ratingRadioGroup.getCheckedRadioButtonId()) {
                rating = map1.get(i);
                break;
            }
        }

        // booking
        for (int i = 0; i < 3; i++) {
            RadioButton radioButton = (RadioButton) bookingRadioGroup.getChildAt(i);
            if (radioButton.getId() == bookingRadioGroup.getCheckedRadioButtonId()) {
                booking = map1.get(i);
                break;
            }
        }

        // priority
        for (int i = 0; i < 3; i++) {
            RadioButton radioButton = (RadioButton) priorityRadioGroup.getChildAt(i);
            if (radioButton.getId() == priorityRadioGroup.getCheckedRadioButtonId()) {
                priority = map2.get(i);
                break;
            }
        }

        sorting = "rating:"+rating+",booking:"+booking+",priority:"+priority;
    }

    private void getListHairStyle() {
        listHairStyleResponse.clear();
        hairStyleAdapter.notifyDataSetChanged();

        customProgressDialog.show();
        HairStyleService.hairStyleService.getListHairStyle(name, sorting, page, items)
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
                                    AppUtils.show((Activity) HairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) HairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) HairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            listHairStyleResponse.clear();
                            List<Map<String, Object>> tmp = (List<Map<String, Object>>) responseCommonDto.get("data");
                            meta = (Map<String, Object>) responseCommonDto.get("meta");
                            popupMenu = AppUtils.renderPagination(btnMenu, btnMenu, meta);
                            pagination();
                            for (Map<String, Object> barberMap : tmp) {
                                listHairStyleResponse.add(barberMap);
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
                            hairStyleAdapter.notifyDataSetChanged();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) HairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) HairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
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
        getListHairStyle();
    }
}