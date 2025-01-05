package com.example.barbershop.fragments;

import android.app.Activity;
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
import com.example.barbershop.adapters.OrderHistoryAdapter;
import com.example.barbershop.constant.AppConstant;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.HairStyleService;
import com.example.barbershop.services.OrderService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OrderHistoryFragment extends Fragment {

    CustomProgressDialog customProgressDialog;
    RecyclerView rcvListOrderHistory;
    OrderHistoryAdapter orderHistoryAdapter;
    List<Map<String, Object>> listOrderHistoryResponse = new ArrayList<>();
    Gson gson = new Gson();
    int orderId = 0;
    Button btnMenu;
    String sortBy, status, codeOrHairStyle, page = "1", items = AppConstant.ITEM_IN_PAGE+"";
    Map<String, Object> meta;
    PopupMenu popupMenu;
    Button btnFilter, btnCloseFilter, btnApplyFilter, btnBack;
    DrawerLayout drawerLayout;
    SearchView keywordSv;
    RadioGroup sortByRadioGroup, statusRadioGroup;
    LinearLayout noResult;
    TextView pageTxt;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) { // chay 1 lan duy nhat khi new fragment
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_order_history, container, false);
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
                        getListOrderHistory();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "InfoFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "login_or_info", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        btnMenu = view.findViewById(R.id.pagination_menu);
        btnFilter = view.findViewById(R.id.btn_filter);
        btnCloseFilter = view.findViewById(R.id.btn_color_filter);

        keywordSv = view.findViewById(R.id.keyword_sv);
        sortByRadioGroup = view.findViewById(R.id.sort_by_radio_group);
        statusRadioGroup = view.findViewById(R.id.status_radio_group);
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
            getListOrderHistory();
        });

        rcvListOrderHistory = view.findViewById(R.id.list_order_history);
        orderHistoryAdapter = new OrderHistoryAdapter(getContext(), listOrderHistoryResponse, 1);
        rcvListOrderHistory.setLayoutManager(new GridLayoutManager(getContext(), 1));
        rcvListOrderHistory.setAdapter(orderHistoryAdapter);
        orderHistoryAdapter.setItemClickListener((View itemView, int position) -> {
            orderId = (int) Double.parseDouble(listOrderHistoryResponse.get(position).get("id")+"");
            MainActivity mainActivity = (MainActivity) OrderHistoryFragment.this.getContext();
            mainActivity.replaceFragment(new OrderHistoryDetailFragment(orderId), "OrderHistoryDetailFragment");
        });

        btnMenu.setOnClickListener(v -> {
            popupMenu.show();
        });

        btnBack = view.findViewById(R.id.btn_back);
        btnBack.setOnClickListener(v -> {
            ((MainActivity) OrderHistoryFragment.this.getContext()).getSupportFragmentManager().popBackStack();
        });

        getListOrderHistory();
    }

    private void getFilterQuery() {
        page = "1";
        codeOrHairStyle = String.valueOf(keywordSv.getQuery());
        if (codeOrHairStyle.equals("")) {
            codeOrHairStyle = null;
        }

        Map<Integer, String> map1 = Map.of(0, "desc", 1, "asc");
        Map<Integer, String> map2 = Map.of(0, "success", 1, "canceled", 2, "all");

        // sort by
        for (int i = 0; i < 2; i++) {
            RadioButton radioButton = (RadioButton) sortByRadioGroup.getChildAt(i);
            if (radioButton.getId() == sortByRadioGroup.getCheckedRadioButtonId()) {
                sortBy = map1.get(i);
                break;
            }
        }

        // status
        for (int i = 0; i < 3; i++) {
            RadioButton radioButton = (RadioButton) statusRadioGroup.getChildAt(i);
            if (radioButton.getId() == statusRadioGroup.getCheckedRadioButtonId()) {
                status = map2.get(i);
                if (i == 2) status = null;
                break;
            }
        }
    }

    private void getListOrderHistory() {
        listOrderHistoryResponse.clear();
        orderHistoryAdapter.notifyDataSetChanged();

        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        customProgressDialog.show();
        OrderService.orderService.getListOrderHistory(bearerToken, codeOrHairStyle, sortBy, status, page, items)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        customProgressDialog.close();
                        pageTxt.setText("page "+page);
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show((Activity) OrderHistoryFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) OrderHistoryFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) OrderHistoryFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) OrderHistoryFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            listOrderHistoryResponse.clear();
                            List<Map<String, Object>> tmp = (List<Map<String, Object>>) responseCommonDto.get("data");
                            meta = (Map<String, Object>) responseCommonDto.get("meta");
                            popupMenu = AppUtils.renderPagination(btnMenu, btnMenu, meta);
                            pagination();
                            for (Map<String, Object> barberMap : tmp) {
                                listOrderHistoryResponse.add(barberMap);
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
                            int start = (Integer.parseInt(page) - 1) * AppConstant.ITEM_IN_PAGE + 1;
                            orderHistoryAdapter.setStart(start);
                            orderHistoryAdapter.notifyDataSetChanged();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) OrderHistoryFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) OrderHistoryFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
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
        getListOrderHistory();
    }
}
