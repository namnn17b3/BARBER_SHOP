package com.example.barbershop;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.example.barbershop.fragments.BarberFragment;
import com.example.barbershop.fragments.HairColorFragment;
import com.example.barbershop.fragments.HairStyleFragment;
import com.example.barbershop.fragments.HomeFragment;
import com.example.barbershop.fragments.InfoFragment;
import com.example.barbershop.fragments.LoginFragment;
import com.example.barbershop.fragments.PaymentResultFragment;
import com.example.barbershop.utils.AppUtils;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

import im.crisp.client.external.ChatActivity;

public class MainActivity extends AppCompatActivity {

    BottomNavigationView bottomNavigationView;
    int currentStateLoginOrInfo = 0;
    Intent crispIntent;
    NavigationBarView.OnItemSelectedListener navigationItemListener;

    public Intent getCrispIntent() {
        return this.crispIntent;
    }

    public NavigationBarView.OnItemSelectedListener getNavigationItemListener() {
        return this.navigationItemListener;
    }

    public BottomNavigationView getBottomNavigationView() {
        return this.bottomNavigationView;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNavigationView = findViewById(R.id.bottomNavigationView);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction().replace(R.id.frame_layout, new HomeFragment());
        }

        navigationItemListener = new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                if (item.getItemId() == R.id.home) {
                    replaceFragment(new HomeFragment(), "HomeFragment");
                } else if (item.getItemId() == R.id.hair_style) {
                    replaceFragment(new HairStyleFragment(), "HairStyleFragment");
                } else if (item.getItemId() == R.id.hair_color) {
                    replaceFragment(new HairColorFragment(), "HairColorFragment");
                } else if (item.getItemId() == R.id.barber) {
                    replaceFragment(new BarberFragment(), "BarberFragment");
                } else if (item.getItemId() == R.id.login_or_info) {
                    if (currentStateLoginOrInfo == R.drawable.baseline_login_24) {
                        replaceFragment(new LoginFragment(), "LoginFragment");
                    } else {
                        replaceFragment(new InfoFragment(), "InfoFragment");
                    }
                }
                return true;
            }
        };

        replaceFragment(new HomeFragment(), false);
        bottomNavigationView.setBackground(null);
        bottomNavigationView.setOnItemSelectedListener(navigationItemListener);

        crispIntent = new Intent(MainActivity.this, ChatActivity.class);
        handleIntentFromBrowser(getIntent());
    }

    public void replaceFragment(Fragment fragment, boolean isBackStack) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction = fragmentTransaction.replace(R.id.frame_layout, fragment);
        if (isBackStack) {
            fragmentTransaction = fragmentTransaction.addToBackStack(null);
        }
        fragmentTransaction.commit();
    }

    public void replaceFragment(Fragment fragment, String identify) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction = fragmentTransaction.replace(R.id.frame_layout, fragment).addToBackStack(identify);
        fragmentTransaction.commit();
    }

    public void changeStateLoginOrInfo(boolean isLogin) {
        MenuItem loginOrInfoItem = bottomNavigationView.getMenu().findItem(R.id.login_or_info);
        if (isLogin) {
            AppUtils.removeDataToSharedPreferences("token", this);
            AppUtils.removeDataToSharedPreferences("user", this);
            loginOrInfoItem.setTitle("Login");
            loginOrInfoItem.setIcon(R.drawable.baseline_login_24);
            currentStateLoginOrInfo = R.drawable.baseline_login_24;
            return;
        }
        loginOrInfoItem.setTitle("Info");
        loginOrInfoItem.setIcon(R.drawable.baseline_info_24);
        currentStateLoginOrInfo = R.drawable.baseline_info_24;
    }

    public void setStatusClickItemMenuBottomNavigation(String itemName) {
        if (itemName.equals("home")) {
            bottomNavigationView.setSelectedItemId(R.id.home);
        } else if (itemName.equals("hair_style")) {
            bottomNavigationView.setSelectedItemId(R.id.hair_style);
        } else if (itemName.equals("hair_color")) {
            bottomNavigationView.setSelectedItemId(R.id.hair_color);
        } else if (itemName.equals("barber")) {
            bottomNavigationView.setSelectedItemId(R.id.barber);
        } else if (itemName.equals("login_or_info")) {
            bottomNavigationView.setSelectedItemId(R.id.login_or_info);
        }
    }

    private void handleIntentFromBrowser(Intent intent) {
        if (intent != null) {
            Uri data = intent.getData();
            if (data != null) {
                PaymentResultFragment paymentResultFragment = new PaymentResultFragment(data);

                String itemNavMenu = "hair_style";
                String fragmentName = "PaymentResultFragment";

                replaceFragment(paymentResultFragment, fragmentName);

                BottomNavigationView bottomNavigationView = getBottomNavigationView();
                NavigationBarView.OnItemSelectedListener navigationItemListener = getNavigationItemListener();
                bottomNavigationView.setOnItemSelectedListener(null);
                setStatusClickItemMenuBottomNavigation(itemNavMenu);
                bottomNavigationView.setOnItemSelectedListener(navigationItemListener);
            }
        }
    }
}
