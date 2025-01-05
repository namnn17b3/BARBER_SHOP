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

public class BarberAdapter extends RecyclerView.Adapter<BarberAdapter.ViewHolder> {
    private List<Map<String, Object>> listBarberResponse;

    private Context context;

    private ItemListener listener;

    public BarberAdapter(Context context, List<Map<String, Object>> listBarberResponse) {
        this.context = context;
        this.listBarberResponse = listBarberResponse;
    }

    @Override
    public int getItemCount() {
        return listBarberResponse.size();
    }

    @NonNull
    @Override
    public BarberAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.barber_list_item, parent, false);
        return new BarberAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Map<String, Object> barber = listBarberResponse.get(position);
        if (barber == null) {
            return;
        }

        holder.barberNameTxt.setText(barber.get("name").toString());
        Glide.with(context).load(barber.get("img").toString()).into(holder.barberImg);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView barberNameTxt;
        ImageView barberImg;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            barberNameTxt = itemView.findViewById(R.id.barber_name);
            barberImg = itemView.findViewById(R.id.barber_img);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) {
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
