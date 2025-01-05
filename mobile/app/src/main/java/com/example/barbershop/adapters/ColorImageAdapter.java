package com.example.barbershop.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.barbershop.R;

import java.util.List;
import java.util.Map;

public class ColorImageAdapter extends RecyclerView.Adapter<ColorImageAdapter.ViewHolder> {
    private List<Map<String, Object>> listColorImageResponse;

    private Context context;

    private ItemListener listener;

    public ColorImageAdapter(Context context, List<Map<String, Object>> listColorImageResponse) {
        this.context = context;
        this.listColorImageResponse = listColorImageResponse;
    }

    @Override
    public int getItemCount() {
        return listColorImageResponse.size();
    }

    @NonNull
    @Override
    public ColorImageAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.color_image_list_item, parent, false);
        return new ColorImageAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Map<String, Object> colorImage = listColorImageResponse.get(position);
        if (colorImage == null) {
            return;
        }

        Glide.with(context).load(colorImage.get("url").toString()).into(holder.colorImageImg);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView colorImageImg;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            colorImageImg = itemView.findViewById(R.id.color_image_img);

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

    public void setItemClickListener(ItemListener listener) {
        this.listener = listener;
    }

    public interface ItemListener {
        void onClickItemListener(View view, int position);
    }
}
