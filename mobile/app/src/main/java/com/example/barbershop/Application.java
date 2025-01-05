package com.example.barbershop;

import androidx.multidex.MultiDexApplication;

import com.example.barbershop.constant.AppConstant;

import im.crisp.client.external.Crisp;

public class Application extends MultiDexApplication {
    @Override
    public void onCreate() {
        super.onCreate();

        Crisp.configure(getApplicationContext(), AppConstant.CHAT_SUPPORT_ID);
    }
}
