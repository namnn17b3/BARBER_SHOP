package com.example.barbershop.adapters;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.barbershop.R;
import com.example.barbershop.utils.AppUtils;

import java.util.List;
import java.util.Map;

public class ColorSpinnerAdapter extends BaseAdapter {
    Context context;
    List<Map<String, Object>> colors;

    public ColorSpinnerAdapter(Context context, List<Map<String, Object>> colors) {
        this.context = context;
        this.colors = colors;
    }

    @Override
    public int getCount() {
        return colors.size();
    }

    @Override
    public Object getItem(int i) {
        return colors.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        view = LayoutInflater.from(context).inflate(R.layout.color_spinner_item, viewGroup, false);

        if (colors.size() == 0) return view;

        Map<String, Object> color = colors.get(i);

        TextView colorTxt = view.findViewById(R.id.color_txt);
        colorTxt.setText(AppUtils.capitalize(color.get("color").toString()));
        colorTxt.setTextColor(Color.parseColor(color.get("colorCode").toString()));

        return view;
    }
}
