package com.example.barbershop.fragments;

import android.app.Activity;
import android.content.res.ColorStateList;
import android.graphics.Color;
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
import android.widget.RadioButton;
import android.widget.RadioGroup;
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
import com.example.barbershop.adapters.ColorImageAdapter;
import com.example.barbershop.constant.AppConstant;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.HairColorService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HairColorFragment extends Fragment {

    RecyclerView rcvListColorImage;
    ColorImageAdapter colorImageAdapter;
    CustomProgressDialog customProgressDialog;
    Button btnMenu;
    Button btnFilter, btnCloseFilter, btnApplyFilter;
    LinearLayout noResult;
    TextView pageTxt;
    DrawerLayout drawerLayout;
    String page = "1", items = AppConstant.ITEM_IN_PAGE+"", color = null;
    PopupMenu popupMenu;
    Map<String, Object> meta;
    List<Map<String, Object>> listHairColorResponse = new ArrayList<>();
    List<Map<String, Object>> listColorImageResponse = new ArrayList<>();
    Gson gson = new Gson();

    RadioGroup colorRadioGroup;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_hair_color, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        getListHairColor();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "HairColorFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "hair_color", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        btnMenu = view.findViewById(R.id.pagination_menu);
        btnFilter = view.findViewById(R.id.btn_filter);
        btnCloseFilter = view.findViewById(R.id.btn_color_filter);
        btnApplyFilter = view.findViewById(R.id.btn_apply_filter);
        colorRadioGroup = view.findViewById(R.id.color_radio_group);

        noResult = view.findViewById(R.id.no_result);
        pageTxt = view.findViewById(R.id.page_txt);

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
            getListColorImage();
        });

        btnMenu.setOnClickListener(v -> {
            popupMenu.show();
        });

        rcvListColorImage = view.findViewById(R.id.list_color_image);
        colorImageAdapter = new ColorImageAdapter(getContext(), listColorImageResponse);
        rcvListColorImage.setLayoutManager(new GridLayoutManager(getContext(), 2));
        rcvListColorImage.setAdapter(colorImageAdapter);

        getListHairColor();
    }

    private void getFilterQuery() {
        page = "1";
        for (int i = 0; i < listHairColorResponse.size(); i++) {
            RadioButton radioButton = (RadioButton) colorRadioGroup.getChildAt(i);
            if (radioButton.getId() == colorRadioGroup.getCheckedRadioButtonId()) {
                color = listHairColorResponse.get(i).get("color").toString();
                break;
            }
        }
    }

    private void getListHairColor() {
        listHairColorResponse.clear();

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
                                    AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            listHairColorResponse = (List<Map<String, Object>>) responseCommonDto.get("data");
                            renderColorRadioButtons();
                            getListColorImage();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        customProgressDialog.close();
                        AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void renderColorRadioButtons() {
        colorRadioGroup.removeAllViews();
        for (Map<String, Object> color : listHairColorResponse) {
            RadioButton radioButton = new RadioButton(HairColorFragment.this.getContext());

            radioButton.setText(AppUtils.capitalize(color.get("color").toString()));
            radioButton.setTextSize(18);
            radioButton.setId(View.generateViewId()); // Tạo ID động
            radioButton.setLayoutParams(new RadioGroup.LayoutParams(
                    RadioGroup.LayoutParams.WRAP_CONTENT,
                    RadioGroup.LayoutParams.WRAP_CONTENT
            ));

            String colorCode = color.get("colorCode").toString();
            ColorStateList colorStateList = ColorStateList.valueOf(Color.parseColor(colorCode));

            radioButton.setButtonTintList(colorStateList);
            radioButton.setTextColor(colorStateList);

            colorRadioGroup.addView(radioButton);
        }

        if (colorRadioGroup.getChildCount() > 0) {
            ((RadioButton) colorRadioGroup.getChildAt(0)).setChecked(true);
            color = listHairColorResponse.get(0).get("color").toString();
        }
    }

    private void getListColorImage() {
        listColorImageResponse.clear();
        colorImageAdapter.notifyDataSetChanged();

        customProgressDialog.show();
        HairColorService.hairColorService.getListColorImage(color, page, items)
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
                                    AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            listColorImageResponse.clear();
                            List<Map<String, Object>> tmp = (List<Map<String, Object>>) responseCommonDto.get("data");
                            meta = (Map<String, Object>) responseCommonDto.get("meta");
                            popupMenu = AppUtils.renderPagination(btnMenu, btnMenu, meta);
                            pagination();
                            for (Map<String, Object> colorImageMap : tmp) {
                                listColorImageResponse.add(colorImageMap);
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
                            colorImageAdapter.notifyDataSetChanged();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        customProgressDialog.close();
                        AppUtils.show((Activity) HairColorFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
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
        getListColorImage();
    }
}
