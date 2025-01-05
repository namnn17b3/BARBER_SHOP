package com.example.barbershop.fragments;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.exifinterface.media.ExifInterface;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.custom.CustomProgressDialog;
import com.example.barbershop.services.UserService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.io.File;
import java.io.FileOutputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileFragment extends Fragment {
    SwipeRefreshLayout swipeRefreshLayout;
    CustomProgressDialog customProgressDialog;
    Button btnBack, btnSubmit1, btnSubmit2;
    EditText emailEdt, usernameEdt, phoneEdt, addressEdt, oldPasswordEdt, newPasswordEdt, confirmPasswordEdt;
    RadioGroup genderRadioGroup;
    ImageView avatarImage;
    Map<String, Object> user;
    Gson gson = new Gson();
    TextView removeAvatarTxt;
    MultipartBody.Part avatar = null;
    androidx.cardview.widget.CardView avatarCardView;
    AlertDialog alertDialog;
    int choose = -1;
    private static final int PICK_IMAGE_REQUEST = 2905;
    private static final int CAMERA_REQUEST_CODE = 100;
    int orientation = -1;
    Uri avatarImageUri;
    Bitmap avatarBitmap;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_profile, container, false);

        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AppUtils.authenGlobal((MainActivity) getContext(), customProgressDialog);
                        choose = -1;
                        oldPasswordEdt.setText("");
                        newPasswordEdt.setText("");
                        confirmPasswordEdt.setText("");
                        renderUIYourProfileForm();
                        swipeRefreshLayout.setRefreshing(false);
                    }
                },1000);
            }
        });

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), customProgressDialog);

        AppUtils.saveDataToSharedPreferences("preFragment", "ProfileFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "login_or_info", getContext());

        btnBack = view.findViewById(R.id.btn_back);
        btnBack.setOnClickListener(v -> {
            ((MainActivity) ProfileFragment.this.getContext()).getSupportFragmentManager().popBackStack();
        });

        emailEdt = view.findViewById(R.id.email_edt);
        usernameEdt = view.findViewById(R.id.username_edt);
        phoneEdt = view.findViewById(R.id.phone_edt);
        addressEdt = view.findViewById(R.id.address_edt);
        genderRadioGroup = view.findViewById(R.id.gender_radio_group);
        avatarImage = view.findViewById(R.id.avatar_img);
        removeAvatarTxt = view.findViewById(R.id.remove_avatar_txt);
        oldPasswordEdt = view.findViewById(R.id.old_password_edt);
        newPasswordEdt = view.findViewById(R.id.new_password_edt);
        confirmPasswordEdt = view.findViewById(R.id.confirm_password_edt);;

        removeAvatarTxt.setOnClickListener(v -> {
            choose = 2;
            Glide.with(getContext()).load(R.drawable.fb_no_img).into(avatarImage);
        });

        btnSubmit1 = view.findViewById(R.id.btn_submit1);
        btnSubmit1.setOnClickListener(v -> {
            updateUserProfile();
        });

        btnSubmit2 = view.findViewById(R.id.btn_submit2);
        btnSubmit2.setOnClickListener(v -> {
            changePassword();
        });

        avatarCardView = view.findViewById(R.id.avatar_card_view);
        avatarCardView.setOnClickListener(v -> {
            alertDialog = AppUtils.showOptionDialog(
                    (Activity) ProfileFragment.this.getContext(),
                    "Notify",
                    "Please, choose a method!",
                    "Photos",
                    "Open camera",
                    new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            alertDialog.dismiss();
                            openPhotos();
                        }
                    },
                    new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            alertDialog.dismiss();
                            openCamera();
                        }
                    }
            );
        });

        renderUIYourProfileForm();

        return view;
    }

    private void renderUIYourProfileForm() {
        user = gson.fromJson(AppUtils.getDataToSharedPreferences("user", getContext()), Map.class);
        emailEdt.setText(user.get("email").toString());
        usernameEdt.setText(user.get("username").toString());

        if (user.get("phone") != null) {
            phoneEdt.setText(user.get("phone").toString());
        } else {
            phoneEdt.setText("");
        }

        if (user.get("address") != null) {
            addressEdt.setText(user.get("address").toString());
        } else {
            addressEdt.setText("");
        }

        if (user.get("gender").toString().equalsIgnoreCase("male")) {
            ((RadioButton) genderRadioGroup.getChildAt(0)).setChecked(true);
        } else {
            ((RadioButton) genderRadioGroup.getChildAt(1)).setChecked(true);
        }

        if (user.get("avatar") != null && !user.get("avatar").toString().isEmpty()) {
            Glide.with(getContext()).load(user.get("avatar").toString()).into(avatarImage);
        } else {
            Glide.with(getContext()).load(R.drawable.fb_no_img).into(avatarImage);
        }
    }

    private void openPhotos() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    private void launchCamera() {
        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (cameraIntent.resolveActivity(getActivity().getPackageManager()) != null) {
            // Tạo file tạm thời để lưu ảnh
            try {
                File tempImageFile = File.createTempFile("captured_image", ".jpg", getActivity().getExternalFilesDir(null));

                // Đọc orientation từ Exif
                ExifInterface exif = new ExifInterface(tempImageFile.getAbsolutePath());
                orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_UNDEFINED);

                avatarImageUri = FileProvider.getUriForFile(getContext(), "com.example.barbershop.fileprovider", tempImageFile);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, avatarImageUri);
                startActivityForResult(cameraIntent, CAMERA_REQUEST_CODE);
                tempImageFile.delete();
            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(getContext(), "Error creating file", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void openCamera() {
        if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            // Yêu cầu quyền CAMERA
            ActivityCompat.requestPermissions(getActivity(),
                    new String[]{Manifest.permission.CAMERA}, CAMERA_REQUEST_CODE);
        } else {
            // Quyền đã được cấp, mở camera
            launchCamera();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == getActivity().RESULT_OK && data != null) {
            choose = 0;
            avatarImageUri = data.getData();
            try {
                avatarBitmap = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), avatarImageUri);
                avatarImage.setImageBitmap(avatarBitmap); // Hiển thị ảnh
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (requestCode == CAMERA_REQUEST_CODE && resultCode == getActivity().RESULT_OK) {
            choose = 1;
            try {
                avatarBitmap = rotateBitmap(MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), avatarImageUri), orientation);
                avatarImage.setImageBitmap(avatarBitmap);
                avatarImageUri = getImageUriFromBitmap(getContext(), avatarBitmap);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private Bitmap rotateBitmap(Bitmap bitmap, int o) {
        Matrix matrix = new Matrix();

        switch (o) {
            case ExifInterface.ORIENTATION_UNDEFINED:
            case ExifInterface.ORIENTATION_ROTATE_90:
                matrix.postRotate(90);
                break;
            case ExifInterface.ORIENTATION_ROTATE_180:
                matrix.postRotate(180);
                break;
            case ExifInterface.ORIENTATION_ROTATE_270:
                matrix.postRotate(270);
                break;
            default:
                return bitmap; // Không cần xoay
        }

        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
    }

    private Uri getImageUriFromBitmap(Context context, Bitmap bitmap) {
        try {
            // Tạo file tạm thời
            File tempFile = File.createTempFile("rotated_image", ".jpg", context.getExternalFilesDir(null));

            // Ghi bitmap vào file
            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out);
            }

            // Trả về URI từ file
            return FileProvider.getUriForFile(context, "com.example.barbershop.fileprovider", tempFile);

        } catch (Exception e) {
            e.printStackTrace();
            return null; // Xử lý lỗi nếu không thể lưu file
        }
    }

    private File saveBitmapToFile(Bitmap bitmap) {
        try {
            File tempFile = File.createTempFile("camera_image", ".jpg", requireContext().getCacheDir());
            FileOutputStream out = new FileOutputStream(tempFile);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out);
            return tempFile;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void updateUserProfile() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        String username = usernameEdt.getText().toString();
        String phone = phoneEdt.getText().toString();
        String address = addressEdt.getText().toString();
        Map<Integer, String> genderMap = Map.of(0, "MALE", 1, "FEMALE");
        String gender = "";
        for (int i = 0; i < 2; i++) {
            RadioButton radioButton = (RadioButton) genderRadioGroup.getChildAt(i);
            if (radioButton.getId() == genderRadioGroup.getCheckedRadioButtonId()) {
                gender = genderMap.get(i);
                break;
            }
        }

        if (choose == 0) {
            String avatarPath = AppUtils.getPath(getContext(), avatarImageUri);
            File avatarFile = new File(avatarPath);
            RequestBody requestFile = RequestBody.create(MediaType.parse("image/jpeg"), avatarFile);
            avatar = MultipartBody.Part.createFormData("avatar", avatarFile.getName(), requestFile);
        } else if (choose == 1) {
            File avatarFile = saveBitmapToFile(avatarBitmap);
            RequestBody requestFile = RequestBody.create(MediaType.parse("image/jpeg"), avatarFile);
            avatar = MultipartBody.Part.createFormData("avatar", avatarFile.getName(), requestFile);
        } else if (choose == 2) {
            avatar = AppUtils.createEmptyFilePart("avatar", "image/jpeg");
        } else if (choose == -1) {
            avatar = null;
        }

        RequestBody usernameBody = RequestBody.create(MediaType.parse("text/plain"), username);
        RequestBody phoneBody = RequestBody.create(MediaType.parse("text/plain"), phone);
        RequestBody addressBody = RequestBody.create(MediaType.parse("text/plain"), address);
        RequestBody genderBody = RequestBody.create(MediaType.parse("text/plain"), gender);

        customProgressDialog.show();
        UserService.userService.updateProfile(bearerToken, usernameBody, phoneBody, addressBody, genderBody, avatar)
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
                                    AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            ((MainActivity) getContext()).changeStateLoginOrInfo(false);
                            user = (Map<String, Object>) responseCommonDto.get("data");
                            AppUtils.saveDataToSharedPreferences("user", gson.toJson(user), getContext());
                            AppUtils.show((Activity) ProfileFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, "Update profile successfully!");
                            renderUIYourProfileForm();
                        } catch (Exception e) {
                            if (customProgressDialog != null) customProgressDialog.close();
                            AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        if (customProgressDialog != null) customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void changePassword() {
        String token = AppUtils.getDataToSharedPreferences("token", getContext());
        String bearerToken = "Bearer "+token;

        String oldPassword = oldPasswordEdt.getText().toString();
        String newPassword = newPasswordEdt.getText().toString();
        String confirmPassword = confirmPasswordEdt.getText().toString();

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("oldPassword", oldPassword);
        map.put("newPassword", newPassword);
        map.put("confirmPassword", confirmPassword);
        String json = gson.toJson(map);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), json);

        customProgressDialog.show();
        UserService.userService.changePassword(bearerToken, requestBody)
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
                                    AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Internal server error!");
                                    return;
                                }
                                if (statusCode == 404) {
                                    AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Resources not found!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = "";
                                List<Map<String, Object>> errors = (List<Map<String,java.lang.Object>>) responseCommonDto.get("errors");
                                for (Map<String, Object> error : errors) {
                                    message = message + error.get("message").toString()+"\n";
                                }
                                AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }
                            responseCommonDto = gson.fromJson(response.body().string(), Map.class);
                            if (responseCommonDto.get("message") != null) {
                                String message = responseCommonDto.get("message").toString();
                                AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                ((MainActivity) getContext()).changeStateLoginOrInfo(true);
                                return;
                            }
                            ((MainActivity) getContext()).changeStateLoginOrInfo(false);
                            String message = ((Map<String, Object>) responseCommonDto.get("data")).get("message").toString();
                            AppUtils.show((Activity) ProfileFragment.this.getContext(),R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, message);
                        } catch (Exception e) {
                            if (customProgressDialog != null) customProgressDialog.close();
                            AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        if (customProgressDialog != null) customProgressDialog.close();
                        t.printStackTrace();
                        AppUtils.show((Activity) ProfileFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }
}
