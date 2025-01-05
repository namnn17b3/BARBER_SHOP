package com.example.barbershop.custom;

import android.app.Dialog;
import android.content.Context;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.example.barbershop.R;
import com.example.barbershop.utils.AppUtils;

public class CustomProgressDialog extends Dialog {

    public CustomProgressDialog(@NonNull Context context) {
        super(context);
        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.gravity = Gravity.CENTER_HORIZONTAL;
        getWindow().setAttributes(params);
        setTitle(null);
        setCancelable(false);
        setOnCancelListener(null);

        View view = LayoutInflater.from(context).inflate(R.layout.loading_layout, null);
        setContentView(view);
    }

    public void close() {
        AppUtils.sleep(2000);
        this.dismiss();
    }
}
