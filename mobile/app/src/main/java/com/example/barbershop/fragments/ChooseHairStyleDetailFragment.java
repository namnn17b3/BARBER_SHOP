package com.example.barbershop.fragments;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.adapters.ChooseHairStyleImageDetailAdapter;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

public class ChooseHairStyleDetailFragment extends Fragment {
    CustomProgressDialog customProgressDialog;
    Button btnOk, btnBack;
    TextView hairStyleNameTxt;
    List<Map<String, Object>> listHairStyleImage = new ArrayList<>();
    RecyclerView rcvListHairStyleImage;
    ChooseHairStyleImageDetailAdapter chooseHairStyleImageDetailAdapter;
    int currentPosition = -1;
    Gson gson = new Gson();
    Map<String, Object> hairStyleImage;
    String hairStyleImageUrl, hairStyleImageName;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_choose_hair_style_detail, container, false);
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
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        AppUtils.saveDataToSharedPreferences("preFragment", "ChooseHairStyleDetailFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "home", getContext());

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        AtomicReference<Bundle> bundle = new AtomicReference<>(getArguments());
        String hairStyleImageJson = bundle.get().getString("hairStyleImageJson");
        hairStyleImage = (Map<String, Object>) gson.fromJson(hairStyleImageJson, Map.class);
        listHairStyleImage = (List<Map<String, Object>>) hairStyleImage.get("imgs");

        btnOk = view.findViewById(R.id.btn_ok);
        if (listHairStyleImage.size() == 0) {
            btnOk.setVisibility(View.GONE);
        } else {
            btnOk.setVisibility(View.VISIBLE);
        }
        btnBack = view.findViewById(R.id.btn_back);
        hairStyleNameTxt = view.findViewById(R.id.hair_style_name);

        hairStyleImageName = hairStyleImage.get("name").toString();
        hairStyleNameTxt.setText(hairStyleImageName);

        rcvListHairStyleImage = view.findViewById(R.id.list_hair_style_image);
        chooseHairStyleImageDetailAdapter = new ChooseHairStyleImageDetailAdapter(getContext(), listHairStyleImage);
        rcvListHairStyleImage.setLayoutManager(new GridLayoutManager(getContext(), 2));
        rcvListHairStyleImage.setAdapter(chooseHairStyleImageDetailAdapter);
        chooseHairStyleImageDetailAdapter.setItemClickListener((v, position) -> {
            View previousImageItemView = AppUtils.getViewFromRecyclerView(rcvListHairStyleImage, currentPosition);
            View currentImageItemView = AppUtils.getViewFromRecyclerView(rcvListHairStyleImage, position);

            if (previousImageItemView != null) {
                AppUtils.setBackgroundTint(previousImageItemView, "#ffffff");
            }
            if (currentImageItemView != null) {
                AppUtils.setBackgroundTint(currentImageItemView, "#0ea5e940");
            }

            hairStyleImageUrl = listHairStyleImage.get(position).get("url").toString();
            currentPosition = position;
        });

        btnBack.setOnClickListener(v -> {
            MainActivity mainActivity = (MainActivity) ChooseHairStyleDetailFragment.this.getContext();
            mainActivity.getSupportFragmentManager().popBackStack();
        });

        btnOk.setOnClickListener(v -> {
            Bundle hairStyleImageBundle = new Bundle();
            Bundle returnBundle = new Bundle();
            returnBundle.putString("url", hairStyleImageUrl);
            returnBundle.putString("name", hairStyleImageName);
            hairStyleImageBundle.putBundle("hairStyleImage", returnBundle);

            ChooseHairStyleDetailFragment.this
                    .getParentFragmentManager()
                    .setFragmentResult("hairStyleImage", hairStyleImageBundle);

            ChooseHairStyleDetailFragment.this
                    .getActivity()
                    .getSupportFragmentManager()
                    .popBackStack("HairFastGanFragment", 0);
        });
    }
}
