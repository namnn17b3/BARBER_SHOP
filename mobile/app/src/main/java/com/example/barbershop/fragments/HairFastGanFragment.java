package com.example.barbershop.fragments;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;
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
import com.example.barbershop.services.HairFastGanService;
import com.example.barbershop.utils.AppUtils;
import com.google.gson.Gson;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HairFastGanFragment extends Fragment {
    CustomProgressDialog customProgressDialog;
    Button btnBack, btnTryNow;
    CardView yourFaceCardView, hairStyleCardView, hairColorCardView;

    ImageView yourFaceImage, hairStyleImage, hairColorImage, resultImage;
    TextView hairStyleTxt, hairColorTxt, downloadTxt;

    Uri yourFaceImageUri;
    Bitmap yourFaceBitmap, resultBitmap;
    String hairStyleImageUrl, hairColorImageUrl, hairColor, hairColorCode, hairStyleName;
    Gson gson = new Gson();
    AlertDialog alertDialog;
    int orientation = -1;
    Map<String, String> labelError = Map.of(
        "image 0", "Your face",
        "image 1", "Hair style",
        "image 2", "Hair color"
    );
    int choose = -1;

    private static final int PICK_IMAGE_REQUEST = 2905;
    private static final int CAMERA_REQUEST_CODE = 100;
    SwipeRefreshLayout swipeRefreshLayout;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_hair_fast_gan, container, false);
        btnBack = view.findViewById(R.id.btn_back);
        btnBack.setOnClickListener(v -> {
            ((MainActivity) HairFastGanFragment.this.getContext()).getSupportFragmentManager().popBackStack();
        });

        yourFaceCardView = view.findViewById(R.id.your_face_card_view);
        yourFaceCardView.setOnClickListener(v -> {
            alertDialog = AppUtils.showOptionDialog(
                (Activity) HairFastGanFragment.this.getContext(),
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


        hairStyleCardView = view.findViewById(R.id.hair_style_card_view);
        hairStyleCardView.setOnClickListener(v -> {
            ((MainActivity) HairFastGanFragment.this.getContext()).replaceFragment(new ChooseHairStyleFragment(), true);
        });

        hairColorCardView = view.findViewById(R.id.hair_color_card_view);
        hairColorCardView.setOnClickListener(v -> {
            ((MainActivity) HairFastGanFragment.this.getContext()).replaceFragment(new ChooseHairColorFragment(), true);
        });

        yourFaceImage = view.findViewById(R.id.your_face_img);
        hairStyleImage = view.findViewById(R.id.hair_style_img);
        hairColorImage = view.findViewById(R.id.hair_color_img);
        resultImage = view.findViewById(R.id.result_img);

        hairStyleTxt = view.findViewById(R.id.hair_style_txt);
        hairColorTxt = view.findViewById(R.id.hair_color_txt);

        customProgressDialog = new CustomProgressDialog(this.getContext());
        AppUtils.authenGlobal((MainActivity) getContext(), null);

        btnTryNow = view.findViewById(R.id.btn_try_now);
        btnTryNow.setOnClickListener(v -> {
            getHairFastGan();
        });

        downloadTxt = view.findViewById(R.id.download_txt);
        downloadTxt.setOnClickListener(v -> {
            downloadResultImage();
        });

        getParentFragmentManager().setFragmentResultListener("colorImage", this, (requestKey, result) -> {
            if ("colorImage".equals(requestKey)) {
                Bundle returnBundle = result.getBundle("colorImage");
                hairColorImageUrl = returnBundle.getString("url");
                hairColor = returnBundle.getString("color");
                hairColorCode = returnBundle.getString("colorCode");
                hairColorTxt.setText(AppUtils.capitalize(hairColor));
                hairColorTxt.setTextColor(Color.parseColor(hairColorCode));
                Glide.with(getContext())
                        .load(hairColorImageUrl)
                        .into(hairColorImage);
            }
        });

        getParentFragmentManager().setFragmentResultListener("hairStyleImage", this, (requestKey, result) -> {
            if ("hairStyleImage".equals(requestKey)) {
                Bundle returnBundle = result.getBundle("hairStyleImage");
                hairStyleImageUrl = returnBundle.getString("url");
                hairStyleName = returnBundle.getString("name");
                hairStyleTxt.setText(AppUtils.capitalize(hairStyleName));
                Glide.with(getContext())
                        .load(hairStyleImageUrl)
                        .into(hairStyleImage);
            }
        });

        return view;
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

        AppUtils.saveDataToSharedPreferences("preFragment", "HairFastGanFragment", getContext());
        AppUtils.saveDataToSharedPreferences("navItem", "home", getContext());

        if (yourFaceImageUri != null) {
            try {
                yourFaceBitmap = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), yourFaceImageUri);
                yourFaceImage.setImageBitmap(yourFaceBitmap); // Hiển thị ảnh
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (resultBitmap != null) {
            resultImage.setImageBitmap(resultBitmap);
        }

        if (hairColorImageUrl != null) {
            Glide.with(getContext())
                    .load(hairColorImageUrl)
                    .into(hairColorImage);
        }

        if (hairStyleImageUrl != null) {
            Glide.with(getContext())
                    .load(hairStyleImageUrl)
                    .into(hairStyleImage);
        }

        if (hairColor != null) {
            hairColorTxt.setText(AppUtils.capitalize(hairColor));
            hairColorTxt.setTextColor(Color.parseColor(hairColorCode));
        }

        if (hairStyleName != null) {
            hairStyleTxt.setText(AppUtils.capitalize(hairStyleName));
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

                yourFaceImageUri = FileProvider.getUriForFile(getContext(), "com.example.barbershop.fileprovider", tempImageFile);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, yourFaceImageUri);
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
            yourFaceImageUri = data.getData();
            try {
                yourFaceBitmap = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), yourFaceImageUri);
                yourFaceImage.setImageBitmap(yourFaceBitmap); // Hiển thị ảnh
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (requestCode == CAMERA_REQUEST_CODE && resultCode == getActivity().RESULT_OK) {
            choose = 1;
            try {
                yourFaceBitmap = rotateBitmap(MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), yourFaceImageUri), orientation);
                yourFaceImage.setImageBitmap(yourFaceBitmap);
                yourFaceImageUri = getImageUriFromBitmap(getContext(), yourFaceBitmap);
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

    private void getHairFastGan() {
        File image = null;

        if (choose == 0) {
            String imagePath = AppUtils.getPath(getContext(), yourFaceImageUri);
            image = new File(imagePath);
        } else if (choose == 1) {
            image = saveBitmapToFile(yourFaceBitmap);
        } else if (choose == -1) {
            image = null;
        }

        if (image == null || hairStyleImageUrl == null || hairColorImageUrl == null) {
            AppUtils.show((Activity) HairFastGanFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Your face image or hair color or hair style is not empty!");
            return;
        }

        RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), image);
        MultipartBody.Part imagePart = MultipartBody.Part.createFormData("image", image.getName(), requestFile);

        RequestBody hairStyleUrlBody = RequestBody.create(MediaType.parse("text/plain"), hairStyleImageUrl);
        RequestBody hairColorUrlBody = RequestBody.create(MediaType.parse("text/plain"), hairColorImageUrl);

        customProgressDialog.show();
        HairFastGanService.hairFastGanService.swapHair(hairStyleUrlBody, hairColorUrlBody, imagePart)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        customProgressDialog.close();
                        try {
                            Map<String, Object> responseCommonDto;
                            if (!response.isSuccessful()) {
                                String json = response.errorBody().string();
                                int statusCode = response.code();
                                System.out.println(">>>>>>>>>>>>>>> status code: "+statusCode);
                                if (statusCode == 500 || statusCode == 404) {
                                    AppUtils.show((Activity) HairFastGanFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Something went wrong!");
                                    return;
                                }
                                responseCommonDto = gson.fromJson(json, Map.class);
                                String message = responseCommonDto.get("error").toString();
                                for (Map.Entry<String, String> entry : labelError.entrySet()) {
                                    message = message.replaceAll(entry.getKey(), entry.getValue());
                                }
                                AppUtils.show((Activity) HairFastGanFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, message);
                                return;
                            }

                            byte[] imageBytes = ((ResponseBody) response.body()).bytes();
                            resultBitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
                            resultImage.setImageBitmap(resultBitmap);
                        } catch (Exception e) {
                            System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR: "+e);
                            customProgressDialog.close();
                            AppUtils.show((Activity) HairFastGanFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        System.out.println(">>>>>>>>>>>> ERROR Throwable");
                        t.printStackTrace();
                        customProgressDialog.close();
                        AppUtils.show((Activity) HairFastGanFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Đã có lỗi xảy ra vui lòng thử lại sau!");
                    }
                });
    }

    private void downloadResultImage() {
        if (resultBitmap == null) return;

        try {
            // Tạo một tệp để lưu ảnh
            String fileName = "result" + System.currentTimeMillis() + ".jpg";
            File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), fileName);

            FileOutputStream fos = new FileOutputStream(file);
            resultBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos); // Lưu ảnh dưới định dạng JPEG
            fos.flush();
            fos.close();

            // Thêm ảnh vào thư viện
            MediaScannerConnection.scanFile(getContext(), new String[]{file.getAbsolutePath()}, null, null);
            AppUtils.show((Activity) HairFastGanFragment.this.getContext(), R.id.successConstrainLayout, R.layout.success_dialog, R.id.successDesc, R.id.successDone, "Download result image successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            AppUtils.show((Activity) HairFastGanFragment.this.getContext(), R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Something went wrong!");
        }
    }
}
