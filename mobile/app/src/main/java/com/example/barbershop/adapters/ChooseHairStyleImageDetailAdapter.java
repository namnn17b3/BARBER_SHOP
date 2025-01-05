package com.example.barbershop.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.barbershop.R;

import java.util.List;
import java.util.Map;

public class ChooseHairStyleImageDetailAdapter extends RecyclerView.Adapter<ChooseHairStyleImageDetailAdapter.ViewHolder> {
    private List<Map<String, Object>> listHairStyleImage;

    private Context context;

    private ColorImageAdapter.ItemListener listener;

    public ChooseHairStyleImageDetailAdapter(Context context, List<Map<String, Object>> listHairStyleImage) {
        this.context = context;
        this.listHairStyleImage = listHairStyleImage;
    }

    @Override
    public int getItemCount() {
        return listHairStyleImage.size();
    }

    @NonNull
    @Override
    public ChooseHairStyleImageDetailAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.choose_hair_style_detail_item, parent, false);
        return new ChooseHairStyleImageDetailAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ChooseHairStyleImageDetailAdapter.ViewHolder holder, int position) {
        Map<String, Object> hairStyleImage = listHairStyleImage.get(position);
        if (hairStyleImage == null) {
            return;
        }
        String url = hairStyleImage.get("url").toString();
        Glide.with(context).load(url).into(holder.hairStyleImageImg);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView hairStyleImageImg;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            hairStyleImageImg = itemView.findViewById(R.id.hair_style_img);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) {
                        itemView.requestFocus();
                        listener.onClickItemListener(v, getAdapterPosition());
                    }
                }
            });
        }
    }

    public void setItemClickListener(ColorImageAdapter.ItemListener listener) {
        this.listener = listener;
    }

    public interface ItemListener {
        void onClickItemListener(View view, int position);
    }
}
