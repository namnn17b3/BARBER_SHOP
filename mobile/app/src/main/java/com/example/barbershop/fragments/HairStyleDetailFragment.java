package com.example.barbershop.fragments;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.ProgressBar;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.denzcoskun.imageslider.ImageSlider;
import com.denzcoskun.imageslider.constants.ScaleTypes;
import com.denzcoskun.imageslider.models.SlideModel;
import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.adapters.ReviewAdapter;
import com.example.barbershop.constant.AppConstant;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.FeedbackService;
import com.example.barbershop.services.HairStyleService;
import com.example.barbershop.utils.AppUtils;
import com.google.android.material.datepicker.MaterialDatePicker;
import com.google.gson.Gson;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HairStyleDetailFragment extends Fragment {
    Button btnBack, btnFilter, btnCloseFilter, btnApplyFilter, btnMenu, btnStartDate, btnEndDate, btnBooking;
    CustomProgressDialog customProgressDialog;
    private int hairStyleId;
    TextView discountTxt, hairStyleNameTxt, ratingTxt, bookingTxt, priceTxt, hairStyleDescriptionTxt;
    Map<String, Object> hairStyle;
    Gson gson = new Gson();
    ImageSlider hairStyleImages;
    DrawerLayout drawerLayout;
    List<Map<String, Object>> listReviewResponse = new ArrayList<>();
    RecyclerView rcvListReview;
    ReviewAdapter reviewAdapter;
    PopupMenu popupMenu;
    String page = "1", items = AppConstant.ITEM_IN_PAGE+"", minStar,
            maxStar, startDate, endDate, rating, date, priority, sorting;
    TextView pageTxt;
    Map<String, Object> meta;
    LinearLayout noResult;
    MaterialDatePicker<Long> materialDatePicker;
    EditText minStarEdt, maxStarEdt;
    RadioGroup ratingRadioGroup, dateRadioGroup, priorityRadioGroup;
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    CheckBox yourFeedbackCheckbox;
    AlertDialog alertDialog;
    List<ProgressBar> progressStars = new ArrayList<>();
    List<TextView> starTxts = new ArrayList<>();
    List<TextView> quantityTxts = new ArrayList<>();
    List<Map<String, Object>> listStatisticFeedback;
    TextView avgStarTxt, statisticRatingTxt, statisticBookingTxt;
    SwipeRefreshLayout swipeRefreshLayout;

    public HairStyleDetailFragment(int hairStyleId) {
        this.hairStyleId = hairStyleId;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_hair_style_detail, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), null);
                        getHairStyleDetail();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        simpleDateFormat.setTimeZone(TimeZone.getDefault());

        btnBack = view.findViewById(R.id.btn_back);
        btnBack.setOnClickListener(v -> {
            getActivity().getSupportFragmentManager().popBackStack();
        });

        customProgressDialog = new CustomProgressDialog(getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        discountTxt = view.findViewById(R.id.discount_txt);
        hairStyleNameTxt = view.findViewById(R.id.hair_style_name);
        ratingTxt = view.findViewById(R.id.rating_txt);
        bookingTxt = view.findViewById(R.id.booking_txt);
        priceTxt = view.findViewById(R.id.price_txt);
        hairStyleDescriptionTxt = view.findViewById(R.id.hair_style_description);
        btnFilter = view.findViewById(R.id.btn_filter);
        btnCloseFilter = view.findViewById(R.id.btn_color_filter);
        noResult = view.findViewById(R.id.no_result);
        pageTxt = view.findViewById(R.id.page_txt);
        hairStyleImages = view.findViewById(R.id.hair_style_imgs);
        btnApplyFilter = view.findViewById(R.id.btn_apply_filter);
        drawerLayout = view.findViewById(R.id.drawer_layout);
        minStarEdt = view.findViewById(R.id.min_star_edt);
        maxStarEdt = view.findViewById(R.id.max_star_edt);
        ratingRadioGroup = view.findViewById(R.id.rating_radio_group);
        dateRadioGroup = view.findViewById(R.id.date_radio_group);
        priorityRadioGroup = view.findViewById(R.id.priority_radio_group);
        yourFeedbackCheckbox = view.findViewById(R.id.your_feedback_chkb);
        avgStarTxt = view.findViewById(R.id.avg_star_txt);
        statisticRatingTxt = view.findViewById(R.id.statistic_rating_txt);
        statisticBookingTxt = view.findViewById(R.id.statistic_booking_txt);
        btnBooking = view.findViewById(R.id.btn_booking);

        progressStars.add(view.findViewById(R.id.progress_star1));
        progressStars.add(view.findViewById(R.id.progress_star2));
        progressStars.add(view.findViewById(R.id.progress_star3));
        progressStars.add(view.findViewById(R.id.progress_star4));
        progressStars.add(view.findViewById(R.id.progress_star5));

        starTxts.add(view.findViewById(R.id.star1_txt));
        starTxts.add(view.findViewById(R.id.star2_txt));
        starTxts.add(view.findViewById(R.id.star3_txt));
        starTxts.add(view.findViewById(R.id.star4_txt));
        starTxts.add(view.findViewById(R.id.star5_txt));

        quantityTxts.add(view.findViewById(R.id.quantity_star1_txt));
        quantityTxts.add(view.findViewById(R.id.quantity_star2_txt));
        quantityTxts.add(view.findViewById(R.id.quantity_star3_txt));
        quantityTxts.add(view.findViewById(R.id.quantity_star4_txt));
        quantityTxts.add(view.findViewById(R.id.quantity_star5_txt));

        for (ProgressBar progressBar : progressStars) {
            progressBar.setMin(0);
            progressBar.setMax(100);
        }

        if (AppUtils.getDataToSharedPreferences("user", getContext()) != null) {
            yourFeedbackCheckbox.setVisibility(View.VISIBLE);
        } else {
            yourFeedbackCheckbox.setVisibility(View.GONE);
        }

        btnBooking.setOnClickListener(v -> {
            String token = AppUtils.getDataToSharedPreferences("token", getContext());
            if (token == null) {
                AppUtils.show((Activity) getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Function require login!");
                return;
            }
            Bundle bundle = new Bundle();
            bundle.putInt("hairStyleId", hairStyleId);
            ChooseDateAndTimeFragment chooseDateAndTimeFragment = new ChooseDateAndTimeFragment();
            chooseDateAndTimeFragment.setArguments(bundle);
            ((MainActivity) getContext()).replaceFragment(chooseDateAndTimeFragment, "ChooseDateAndTimeFragment");
        });

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
            getListReview(true);
        });

        rcvListReview = view.findViewById(R.id.list_review);
        reviewAdapter = new ReviewAdapter(getContext(), listReviewResponse);
        rcvListReview.setLayoutManager(new LinearLayoutManager(getContext()));
        rcvListReview.setAdapter(reviewAdapter);

        btnMenu = view.findViewById(R.id.pagination_menu);
        btnMenu.setOnClickListener(v -> {
            popupMenu.show();
        });

        btnStartDate = view.findViewById(R.id.btn_start_date);
        btnStartDate.setOnClickListener(v -> {
            long dateTime = System.currentTimeMillis();
            if (startDate != null) {
                try {
                    dateTime = AppUtils.getDateInstanceWithTimezone(simpleDateFormat.parse(startDate), "Asia/Ho_Chi_Minh").getTime();
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
            }
            startDate = simpleDateFormat.format(new Date(dateTime));
            btnStartDate.setText(startDate);
            materialDatePicker = MaterialDatePicker.Builder.datePicker()
                    .setTitleText("Select start date")
                    .setSelection(dateTime)
                    .build();
            materialDatePicker.addOnPositiveButtonClickListener(selection -> {
                startDate = simpleDateFormat.format(new Date(selection));
                btnStartDate.setText(startDate);
            });
            materialDatePicker.show(getActivity().getSupportFragmentManager(), "tag");
        });

        btnEndDate = view.findViewById(R.id.btn_end_date);
        btnEndDate.setOnClickListener(v -> {
            long dateTime = System.currentTimeMillis();
            if (endDate != null) {
                try {
                    dateTime = AppUtils.getDateInstanceWithTimezone(simpleDateFormat.parse(endDate), "Asia/Ho_Chi_Minh").getTime();
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
            }
            endDate = simpleDateFormat.format(new Date(dateTime));
            btnEndDate.setText(endDate);
            materialDatePicker = MaterialDatePicker.Builder.datePicker()
                    .setTitleText("Select end date")
                    .setSelection(dateTime)
                    .build();
            materialDatePicker.addOnPositiveButtonClickListener(selection -> {
                endDate = simpleDateFormat.format(new Date(selection));
                btnEndDate.setText(endDate);
            });
            materialDatePicker.show(getActivity().getSupportFragmentManager(), "tag");
        });

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        AppUtils.saveDataToSharedPreferences("preFragment", "HairStyleDetailFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "hair_style", getContext());

        getHairStyleDetail();
    }

    private void getHairStyleDetail() {
        customProgressDialog.show();
        HairStyleService.hairStyleService.getDetailHairStyle(hairStyleId)
                .enqueue(new Callback<Map<String, Object>>() {
                    @Override
                    public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            hairStyle = (Map<String, Object>) responseCommonDto.get("data");
                            updateUI();
                            getStatisticFeedback(false);
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void updateUI() {
        hairStyleNameTxt.setText(hairStyle.get("name").toString());

        int price = (int) Double.parseDouble(hairStyle.get("price")+"");
        priceTxt.setText(AppUtils.toVNNumberFormat(price)+" đ");

        if (hairStyle.get("booking") != null) {
            int booking = (int) Double.parseDouble(hairStyle.get("booking")+"");
            if (booking > 0) {
                bookingTxt.setText("("+booking+") booking");
            } else {
                bookingTxt.setText("No booking");
            }
        } else {
            bookingTxt.setText("No booking");
        }

        if (hairStyle.get("rating") != null) {
            float rating = Float.parseFloat(hairStyle.get("rating")+"");
            if (rating > 0) {
                ratingTxt.setText("("+hairStyle.get("rating").toString()+") |");
            } else {
                ratingTxt.setText("No rating |");
            }
        } else {
            ratingTxt.setText("No rating |");
        }

        Map<String, Object> discount = (Map<String, Object>) hairStyle.get("discount");
        if (discount != null) {
            String unit = discount.get("unit").toString().equals("%") ? discount.get("unit").toString() : " đ";
            int value = (int) Double.parseDouble(discount.get("value")+"");
            discountTxt.setText("Discount "+AppUtils.toVNNumberFormat(value)+unit);
        } else {
            discountTxt.setText("No discount");
        }

        hairStyleDescriptionTxt.setText(hairStyle.get("description").toString());

        List<SlideModel> slideModels = new ArrayList<>();
        List<Map<String, Object>> imgs = (List<Map<String, Object>>) hairStyle.get("imgs");
        for (Map<String, Object> img : imgs) {
            SlideModel slideModel = new SlideModel(img.get("url").toString(), ScaleTypes.FIT);
            slideModels.add(slideModel);
        }
        hairStyleImages.setImageList(slideModels);
    }

    private void getFilterQuery() {
        page = "1";
        minStar = minStarEdt.getText().toString();
        maxStar = maxStarEdt.getText().toString();

        Map<Integer, String> map1 = Map.of(0, "asc", 1, "desc", 2, "none");
        Map<Integer, String> map2 = Map.of(0, "star", 1, "time", 2, "none");

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
            RadioButton radioButton = (RadioButton) dateRadioGroup.getChildAt(i);
            if (radioButton.getId() == dateRadioGroup.getCheckedRadioButtonId()) {
                date = map1.get(i);
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

        sorting = "star:"+rating+",time:"+date+",priority:"+priority;
    }

    private void getStatisticFeedback(boolean isShowCustomDialog) {
        if (isShowCustomDialog) customProgressDialog.show();
        FeedbackService.feedbackService.getStatisticFeedback(hairStyleId)
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
                                    AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            listStatisticFeedback = (List<Map<String, Object>>) responseCommonDto.get("data");
                            updateStatisticFeedbackUI();
                            getListReview(false);
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void updateStatisticFeedbackUI() {
        int totalBooking = 0;
        for (int i = 0; i < 5; i++) {
            Map<String, Object> statisticFeedback = listStatisticFeedback.get(i);
            totalBooking = totalBooking + ((int) Double.parseDouble(statisticFeedback.get("reviews")+""));
            TextView quantityTxt = quantityTxts.get(i);
            quantityTxt.setText(((int) Double.parseDouble(statisticFeedback.get("reviews")+"")+""));
        }
        if (hairStyle.get("booking") != null) {
            int booking = (int) Double.parseDouble(hairStyle.get("booking")+"");
            if (booking > 0) {
                statisticBookingTxt.setText("("+booking+") booking");
            } else {
                statisticBookingTxt.setText("No booking");
            }
        } else {
            statisticBookingTxt.setText("No booking");
        }

        if (hairStyle.get("rating") != null) {
            float rating = Float.parseFloat(hairStyle.get("rating")+"");
            if (rating > 0) {
                statisticRatingTxt.setText("("+hairStyle.get("rating").toString()+") |");
                avgStarTxt.setText(hairStyle.get("rating").toString()+" out of 5");
            } else {
                statisticRatingTxt.setText("No rating |");
                avgStarTxt.setText("No review");
            }
        } else {
            statisticRatingTxt.setText("No rating |");
            avgStarTxt.setText("No review");
        }


        for (int i = 0; i < 5; i++) {
            Map<String, Object> statisticFeedback = listStatisticFeedback.get(i);
            ProgressBar progressStar = progressStars.get(i);
            if (totalBooking > 0) {
                progressStar.setProgress((int) (Double.parseDouble(statisticFeedback.get("reviews")+"")/totalBooking*100));
            } else {
                progressStar.setProgress(0);
            }
        }
    }

    private void getListReview(boolean isShowCustomDialog) {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;
        if (token == null) {
            bearerToken = null;
        }
        if (!yourFeedbackCheckbox.isChecked()) {
            bearerToken = null;
        }

        if (isShowCustomDialog) customProgressDialog.show();
        FeedbackService.feedbackService.getListReview(bearerToken, hairStyleId, minStar, maxStar, startDate, endDate, sorting, page, items)
                .enqueue(new Callback<Map<String, Object>>() {
                    @Override
                    public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                        pageTxt.setText("page "+page);
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                if (statusCode == 500) {
                                    AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                if (statusCode == 401) {
                                    alertDialog = AppUtils.showOptionDialog(
                                        getActivity(), "Session was expired!", "Please login again",
                                        "No, thanks", "Login now!",
                                        new View.OnClickListener() {
                                            @Override
                                            public void onClick(View view) {
                                                alertDialog.dismiss();
                                            }
                                        },
                                        new View.OnClickListener() {
                                            @Override
                                            public void onClick(View view) {
                                                ((MainActivity) getActivity()).changeStateLoginOrInfo(true);
                                                alertDialog.dismiss();
                                                ((MainActivity) getActivity()).setStatusClickItemMenuBottomNavigation("login_or_info");
                                            }
                                        }
                                    );
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = response.body();
                            listReviewResponse.clear();
                            List<Map<String, Object>> tmp = (List<Map<String, Object>>) responseCommonDto.get("data");
                            meta = (Map<String, Object>) responseCommonDto.get("meta");
                            popupMenu = AppUtils.renderPagination(btnMenu, btnMenu, meta);
                            pagination();
                            for (Map<String, Object> barberMap : tmp) {
                                listReviewResponse.add(barberMap);
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
                            reviewAdapter.notifyDataSetChanged();
                        } catch (Exception e) {
                            customProgressDialog.close();
                            AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) HairStyleDetailFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
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

        getHairStyleDetail();
    }
}
