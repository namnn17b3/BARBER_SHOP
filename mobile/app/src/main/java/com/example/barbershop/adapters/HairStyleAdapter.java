package com.example.barbershop.adapters;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.barbershop.MainActivity;
import com.example.barbershop.R;
import com.example.barbershop.fragments.BarberDetailFragment;
import com.example.barbershop.fragments.ChooseDateAndTimeFragment;
import com.example.barbershop.utils.AppUtils;

import java.util.List;
import java.util.Map;

public class HairStyleAdapter extends RecyclerView.Adapter<HairStyleAdapter.ViewHolder> {
    private List<Map<String, Object>> listHairStyleResponse;

    private Context context;

    private ItemListener listener;

    public HairStyleAdapter(Context context, List<Map<String, Object>> listHairStyleResponse) {
        this.context = context;
        this.listHairStyleResponse = listHairStyleResponse;
    }

    @Override
    public int getItemCount() {
        return listHairStyleResponse.size();
    }

    @NonNull
    @Override
    public HairStyleAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.hair_style_item, parent, false);
        return new HairStyleAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Map<String, Object> hairStyle = listHairStyleResponse.get(position);
        if (hairStyle == null) {
            return;
        }

        holder.hairStyleNameTxt.setText(hairStyle.get("name").toString());

        int price = (int) Double.parseDouble(hairStyle.get("price")+"");
        holder.priceTxt.setText(AppUtils.toVNNumberFormat(price)+" đ");

        if (hairStyle.get("booking") != null) {
            int booking = (int) Double.parseDouble(hairStyle.get("booking")+"");
            if (booking > 0) {
                holder.bookingTxt.setText("("+booking+") booking");
            } else {
                holder.bookingTxt.setText("No booking");
            }
        } else {
            holder.bookingTxt.setText("No booking");
        }

        if (hairStyle.get("rating") != null) {
            float rating = Float.parseFloat(hairStyle.get("rating")+"");
            if (rating > 0) {
                holder.ratingTxt.setText("("+hairStyle.get("rating").toString()+") |");
            } else {
                holder.ratingTxt.setText("No rating |");
            }
        } else {
            holder.ratingTxt.setText("No rating |");
        }

        Map<String, Object> discount = (Map<String, Object>) hairStyle.get("discount");
        if (discount != null) {
            String unit = discount.get("unit").toString().equals("%") ? discount.get("unit").toString() : " đ";
            int value = (int) Double.parseDouble(discount.get("value")+"");
            holder.discountTxt.setText("Discount "+AppUtils.toVNNumberFormat(value)+unit);
        } else {
            holder.discountTxt.setText("No discount");
        }

        Map<String, Object> img = (Map<String, Object>) hairStyle.get("img");
        Glide.with(context).load(img.get("url").toString()).into(holder.hairStyleImg);
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView hairStyleNameTxt, discountTxt, ratingTxt, bookingTxt, priceTxt;
        ImageView hairStyleImg;
        Button btnBooking;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            hairStyleNameTxt = itemView.findViewById(R.id.hair_style_name);
            discountTxt = itemView.findViewById(R.id.discount_txt);
            ratingTxt = itemView.findViewById(R.id.rating_txt);
            bookingTxt = itemView.findViewById(R.id.booking_txt);
            priceTxt = itemView.findViewById(R.id.price_txt);
            hairStyleImg = itemView.findViewById(R.id.hair_style_img);
            btnBooking = itemView.findViewById(R.id.btn_booking);

            btnBooking.setOnClickListener(v -> {
                String token = AppUtils.getDataToSharedPreferences("token", context);
                if (token == null) {
                    AppUtils.show((Activity) context, R.id.errorConstrainLayout, R.layout.error_dialog, R.id.errorDesc, R.id.errorDone, "Function require login!");
                    return;
                }
                int position = getAdapterPosition();
                Map<String, Object> hairStyle = listHairStyleResponse.get(position);
                int hairStyleId = (int) (Double.parseDouble(hairStyle.get("id")+""));
                Bundle bundle = new Bundle();
                bundle.putInt("hairStyleId", hairStyleId);
                ChooseDateAndTimeFragment chooseDateAndTimeFragment = new ChooseDateAndTimeFragment();
                chooseDateAndTimeFragment.setArguments(bundle);
                ((MainActivity) context).replaceFragment(chooseDateAndTimeFragment, "ChooseDateAndTimeFragment");
            });

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
