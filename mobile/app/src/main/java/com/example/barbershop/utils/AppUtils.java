package com.example.barbershop.utils;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.PopupMenu;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.constant.AppConstant;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.UserService;
import com.google.gson.Gson;

import java.io.File;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import im.crisp.client.external.Crisp;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AppUtils {
    public static void show(Activity activity, int constrain, int dialog, int messageId, int btnClose, String message) {
        ConstraintLayout constraintLayout = activity.findViewById(constrain);
        View view = LayoutInflater.from(activity).inflate(dialog, constraintLayout);
        Button btn = view.findViewById(btnClose);

        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setView(view);
        final AlertDialog alertDialog = builder.create();
        TextView errorDesc = view.findViewById(messageId);
        errorDesc.setText(message);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                alertDialog.dismiss();
            }
        });

        if (alertDialog.getWindow() != null) {
            alertDialog.getWindow().setBackgroundDrawable(new ColorDrawable(0));
        }
        alertDialog.show();
    }

    public static String getCookie(String cookies, String key) {
        Map<String, String> map = new HashMap<>();
        String[] arr = cookies.split("; ");
        for (String s : arr) {
            String[] childArr = s.split("=");
            if (childArr.length == 2) {
                map.put(childArr[0], childArr[1]);
            }
        }
        return map.get(key);
    }

    public static void saveDataToSharedPreferences(String key, String value, Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(AppConstant.SHARED_PREFERENCES, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(key, value);
        editor.apply();
    }

    public static String getDataToSharedPreferences(String key, Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(AppConstant.SHARED_PREFERENCES, Context.MODE_PRIVATE);
        return sharedPreferences.getString(key, null);
    }

    public static void removeDataToSharedPreferences(String key, Context context) {
        SharedPreferences preferences = context.getSharedPreferences(AppConstant.SHARED_PREFERENCES, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.remove(key);
        editor.apply();
    }

//    public static ProgressBar makeProgressBar(Context context) {
//        ProgressBar progressBar = new ProgressBar(context);
//
//        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(
//                context.getResources().getDimensionPixelSize(R.dimen.progress_bar_width),
//                context.getResources().getDimensionPixelSize(R.dimen.progress_bar_height));
//        progressBar.setLayoutParams(layoutParams);
//
//        int color = context.getResources().getColor(R.color.login_title);
//        progressBar.setIndeterminateTintList(ColorStateList.valueOf(color));
//
//        Drawable drawable = context.getResources().getDrawable(R.drawable.progress_bg);
//        progressBar.setBackground(drawable);
//
//        return progressBar;
//    }

    public static void sleep(int ms) {
        try {
            Thread.sleep(ms);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String stringifyFromStringDate(String s) {
        String[] monthStrings = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        String[] arr = s.replaceAll(",", "").split("\\s+");
        String month = "";
        for (int i = 0; i < monthStrings.length; i++) {
            if (monthStrings[i].equals(arr[0])) {
                if (i + 1 > 9) {
                    month = String.valueOf(i + 1);
                } else {
                    month = "0"+String.valueOf(i + 1);
                }
                break;
            }
        }
        String day = arr[1].length() == 1 ? "0"+arr[1] : arr[1];
        String year = arr[2];
        return year+"-"+month+"-"+day;
    }

    public static PopupMenu renderPagination(@NonNull View view, Button btnMenu, Map<String, Object> meta) {
        if (meta == null) {
            return null;
        }
        int page = (int) Double.parseDouble(meta.get("page")+"");
        int items = (int) Double.parseDouble(meta.get("items")+"");
        int totalRecords = (int) Double.parseDouble(meta.get("totalRecords")+"");
        int totalPages = totalRecords % items == 0 ? totalRecords / items : totalRecords / items + 1;

        if (totalPages <= 1) {
            btnMenu.setVisibility(View.GONE);
            return null;
        }

        int nodes = AppConstant.PAGINATION_NODES;
        int startPage = page - (page - 1) % nodes;
        int endPage = startPage + nodes - 1 > totalPages ? totalPages : startPage + nodes - 1;

        PopupMenu popupMenu = new PopupMenu(view.getContext(), view);
        popupMenu.inflate(R.menu.pagination_menu);

        if (page > 1) {
            popupMenu.getMenu().add(Menu.NONE, page - 1, Menu.NONE, "Previous page");
        }
        for (int i = startPage; i <= endPage; i++) {
            popupMenu.getMenu().add(Menu.NONE, i, Menu.NONE, "Page "+i);
        }
        if (page < totalPages) {
            popupMenu.getMenu().add(Menu.NONE, page + 1, Menu.NONE, "Next page");
        }

        btnMenu.setVisibility(View.VISIBLE);

        return popupMenu;
    }

    public static String capitalize(String s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    public static View getViewFromRecyclerView(RecyclerView recyclerView, int position) {
        // Lấy ViewHolder tại vị trí cụ thể
        RecyclerView.ViewHolder viewHolder = recyclerView.findViewHolderForAdapterPosition(position);

        if (viewHolder != null) {
            return viewHolder.itemView; // Trả về View tương ứng với ViewHolder
        } else {
            return null; // Nếu View chưa được hiển thị trên màn hình
        }
    }

    public static void setBackgroundTint(View view, String color) {
        view.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor(color)));
    }

    public static String getPath(Context context, Uri uri) {
        Cursor cursor = context.getContentResolver().query(uri, null, null, null, null);
        if (cursor == null) {
            return uri.getPath();
        } else {
            cursor.moveToFirst();
            int index = cursor.getColumnIndex(MediaStore.Images.Media.DATA);
            String path = cursor.getString(index);
            cursor.close();
            return path;
        }
    }

    public static AlertDialog showOptionDialog(
            Activity activity, String optionTitle, String message,
            String s1, String s2,
            View.OnClickListener listener1, View.OnClickListener listener2) {

        ConstraintLayout constraintLayout = activity.findViewById(R.id.option_dialog_constrain_layout);
        View view = LayoutInflater.from(activity).inflate(R.layout.option_dialog, constraintLayout);

        AlertDialog alertDialog = getAlertDialog(activity, view);

        Button btnOption1 = view.findViewById(R.id.option1);
        Button btnOption2 = view.findViewById(R.id.option2);
        Button btnCancel = view.findViewById(R.id.cancel_button);

        TextView optionDescTxt = view.findViewById(R.id.option_desc);
        TextView optionTitleTxt = view.findViewById(R.id.option_title);

        optionTitleTxt.setText(optionTitle);
        optionDescTxt.setText(message);

        btnOption1.setText(s1);
        btnOption2.setText(s2);

        btnOption1.setOnClickListener(listener1);
        btnOption2.setOnClickListener(listener2);

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                alertDialog.dismiss();
            }
        });

        if (alertDialog.getWindow() != null) {
            alertDialog.getWindow().setBackgroundDrawable(new ColorDrawable(0));
        }
        alertDialog.show();
        return alertDialog;
    }

    public static AlertDialog getAlertDialog(Activity activity, View view) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setView(view);
        final AlertDialog alertDialog = builder.create();
        return alertDialog;
    }

    public static void authenGlobal(MainActivity mainActivity, CustomProgressDialog customProgressDialog) {
        String tokenEncodeURIComponent = getDataToSharedPreferences("token", mainActivity);
        if (tokenEncodeURIComponent == null) {
            tokenEncodeURIComponent = "null";
        }

        if (customProgressDialog != null) customProgressDialog.show();
        Gson gson = new Gson();
        UserService.userService.me(tokenEncodeURIComponent)
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
                                    AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                mainActivity.changeStateLoginOrInfo(true);
                                return;
                            }
                            mainActivity.changeStateLoginOrInfo(false);
                            Map<String, Object> user = (Map<String, Object>) responseCommonDto.get("data");
                            AppUtils.saveDataToSharedPreferences("user", gson.toJson(user), mainActivity);
                            int userId = (int) Double.parseDouble(user.get("id")+"");
                            String role = user.get("role").toString();
                            if (role.equalsIgnoreCase("USER")) {
                                Crisp.setTokenID(mainActivity, "user_"+userId);
                                Crisp.setUserEmail(user.get("email").toString());
                                Crisp.setUserNickname(user.get("username").toString());
                                if (user.get("phone") != null) Crisp.setUserPhone(user.get("phone").toString());
                                if (user.get("avatar") != null) Crisp.setUserAvatar(user.get("avatar").toString());
                            }
                        } catch (Exception e) {
                            if (customProgressDialog != null) customProgressDialog.close();
                            AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        if (customProgressDialog != null) customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show(mainActivity, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    public static String toVNNumberFormat(int number) {
        // Định dạng số với dấu phân cách nghìn
        DecimalFormat formatter = new DecimalFormat("#,###");
        String formattedNumber = formatter.format(number);

        return formattedNumber.replaceAll(",", ".");  // Output: 250.000
    }

    public static Date getDateInstanceWithTimezone(Date date, String timezone) {
        if (timezone.equals("Asia/Ho_Chi_Minh")) {
            return new Date(date.getTime() + 7*60*60*1000);
        }
        return date;
    }

    public static MultipartBody.Part createEmptyFilePart(String partName, String mediaType) {
        String extendFile = ".txt";
        if (mediaType.equalsIgnoreCase("text/plain")) {
            extendFile = ".txt";
        } else if (mediaType.equalsIgnoreCase("image/*")) {
            extendFile = ".jpg";
        }
        try {
            // Tạo tệp trống
            File emptyFile = File.createTempFile("empty", extendFile);
            // Xác định loại tệp
            RequestBody requestFile = RequestBody.create(emptyFile, MediaType.parse(mediaType));
            // Tạo phần multipart
            return MultipartBody.Part.createFormData(partName, emptyFile.getName(), requestFile);
        } catch (Exception exception) {
            throw new RuntimeException(exception);
        }
    }
}
