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

public class ChooseHairStyleImageAdapter extends RecyclerView.Adapter<ChooseHairStyleImageAdapter.ViewHolder> {
    private List<Map<String, Object>> listHairStyleResponse;

    private Context context;

    private ColorImageAdapter.ItemListener listener;

    public ChooseHairStyleImageAdapter(Context context, List<Map<String, Object>> listHairStyleResponse) {
        this.context = context;
        this.listHairStyleResponse = listHairStyleResponse;
    }

    @Override
    public int getItemCount() {
        return listHairStyleResponse.size();
    }

    @NonNull
    @Override
    public ChooseHairStyleImageAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.choose_hair_style_item, parent, false);
        return new ChooseHairStyleImageAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ChooseHairStyleImageAdapter.ViewHolder holder, int position) {
        Map<String, Object> hairStyle = listHairStyleResponse.get(position);
        if (hairStyle == null) {
            return;
        }

        List<Map<String, Object>> imgs = (List<Map<String, Object>>) hairStyle.get("imgs");
        String url = imgs.get(0).get("url").toString();
        holder.hairStyleNameTxt.setText(hairStyle.get("name").toString());
        Glide.with(context).load(url).into(holder.hairStyleImageImg);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView hairStyleImageImg;
        TextView hairStyleNameTxt;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            hairStyleImageImg = itemView.findViewById(R.id.hair_style_img);
            hairStyleNameTxt = itemView.findViewById(R.id.hair_style_name);

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

