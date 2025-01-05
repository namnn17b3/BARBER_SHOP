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
import android.widget.LinearLayout;
import android.widget.PopupMenu;
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
import com.example.barbershop.adapters.ChooseHairStyleImageAdapter;
import com.example.barbershop.adapters.ColorImageAdapter;
import com.example.barbershop.constant.AppConstant;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.HairStyleService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChooseHairStyleFragment extends Fragment {

    CustomProgressDialog customProgressDialog;
    RecyclerView rcvListHairStyle;
    ChooseHairStyleImageAdapter hairStyleAdapter;
    List<Map<String, Object>> listHairStyleResponse = new ArrayList<>();
    Intent intent;
    Gson gson = new Gson();
    int hairStyleId = 0;
    Button btnMenu;
    String name, page = "1", items = AppConstant.ITEM_IN_PAGE+"";
    Map<String, Object> meta;
    PopupMenu popupMenu;
    Button btnFilter, btnCloseFilter, btnApplyFilter, btnOk, btnBack;
    DrawerLayout drawerLayout;
    SearchView hairStyleNameSv;
    LinearLayout noResult;
    TextView pageTxt;
    Map<String, Object> hairStyleImage;
    int currentPosition = -1;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) { // chay 1 lan duy nhat khi new fragment
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_choose_hair_style, container, false);
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
                        getListHairStyleImage();
                        btnOk.setVisibility(View.GONE);
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "ChooseHairStyleFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "home", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        btnMenu = view.findViewById(R.id.pagination_menu);
        btnFilter = view.findViewById(R.id.btn_filter);
        btnCloseFilter = view.findViewById(R.id.btn_color_filter);

        hairStyleNameSv = view.findViewById(R.id.hair_style_name_sv);
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
            getListHairStyleImage();
        });

        btnOk = view.findViewById(R.id.btn_ok);
        btnOk.setOnClickListener(v -> {
            if (hairStyleImage == null) {
                AppUtils.show((Activity) ChooseHairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Please choose hair style!");
                return;
            }
            ChooseHairStyleDetailFragment chooseHairStyleDetailFragment = new ChooseHairStyleDetailFragment();
            Bundle bundle = new Bundle();
            bundle.putString("hairStyleImageJson", gson.toJson(hairStyleImage));
            chooseHairStyleDetailFragment.setArguments(bundle);
            ((MainActivity) ChooseHairStyleFragment.this.getContext()).replaceFragment(
                chooseHairStyleDetailFragment, true
            );
        });

        btnBack = view.findViewById(R.id.btn_back);
        btnBack.setOnClickListener(v -> {
            MainActivity mainActivity = (MainActivity) ChooseHairStyleFragment.this.getContext();
            mainActivity.getSupportFragmentManager().popBackStack();
        });

        rcvListHairStyle = view.findViewById(R.id.list_hair_style);
        hairStyleAdapter = new ChooseHairStyleImageAdapter(getContext(), listHairStyleResponse);
        rcvListHairStyle.setLayoutManager(new GridLayoutManager(getContext(), 2));
        rcvListHairStyle.setAdapter(hairStyleAdapter);
        hairStyleAdapter.setItemClickListener((View itemView, int position) -> {
            hairStyleId = (int) Double.parseDouble(listHairStyleResponse.get(position).get("id")+"");

            View previousImageItemView = AppUtils.getViewFromRecyclerView(rcvListHairStyle, currentPosition);
            View currentImageItemView = AppUtils.getViewFromRecyclerView(rcvListHairStyle, position);

            if (previousImageItemView != null) {
                AppUtils.setBackgroundTint(previousImageItemView, "#ffffff");
            }
            if (currentImageItemView != null) {
                AppUtils.setBackgroundTint(currentImageItemView, "#0ea5e940");
            }

            hairStyleImage = listHairStyleResponse.get(position);
            currentPosition = position;
        });

        btnMenu.setOnClickListener(v -> {
            popupMenu.show();
        });

        getListHairStyleImage();
    }

    private void getFilterQuery() {
        page = "1";
        name = String.valueOf(hairStyleNameSv.getQuery());
        if (name.equals("")) {
            name = null;
        }
    }

    private void getListHairStyleImage() {
        listHairStyleResponse.clear();
        hairStyleAdapter.notifyDataSetChanged();

        customProgressDialog.show();
        HairStyleService.hairStyleService.getListHairStyleImage(name, page, items)
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
                                    AppUtils.show((Activity) ChooseHairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) ChooseHairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) ChooseHairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
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
                                btnOk.setVisibility(View.GONE);
                            } else {
                                noResult.setVisibility(View.GONE);
                                pageTxt.setVisibility(View.VISIBLE);
                                btnOk.setVisibility(View.VISIBLE);
                            }
                            if (drawerLayout != null && drawerLayout.isDrawerOpen(GravityCompat.START)) {
                                drawerLayout.closeDrawer(GravityCompat.START); // Mở Navigation Drawer
                            }
                            hairStyleAdapter.notifyDataSetChanged();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) ChooseHairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        customProgressDialog.close();
                        AppUtils.show((Activity) ChooseHairStyleFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
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
        getListHairStyleImage();
    }
}