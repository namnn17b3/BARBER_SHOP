package com.example.barbershop.adapters;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.barbershop.R;
import com.example.barbershop.utils.AppUtils;

import java.util.List;
import java.util.Map;

public class PaymentTypeSpinnerAdapter extends BaseAdapter {

    Context context;
    List<String> paymentTypes;

    public PaymentTypeSpinnerAdapter(Context context, List<String> paymentTypes) {
        this.context = context;
        this.paymentTypes = paymentTypes;
    }

    @Override
    public int getCount() {
        return paymentTypes.size();
    }

    @Override
    public Object getItem(int i) {
        return paymentTypes.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        view = LayoutInflater.from(context).inflate(R.layout.color_spinner_item, viewGroup, false);

        String paymentType = paymentTypes.get(i);

        TextView colorTxt = view.findViewById(R.id.color_txt);
        colorTxt.setText(paymentType);
        colorTxt.setTypeface(null, Typeface.BOLD);

        return view;
    }
}
