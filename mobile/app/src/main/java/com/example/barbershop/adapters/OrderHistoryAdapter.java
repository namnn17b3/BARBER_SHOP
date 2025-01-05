package com.example.barbershop.adapters;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.barbershop.R;
import com.example.barbershop.utils.AppUtils;

import java.util.List;
import java.util.Map;

public class OrderHistoryAdapter extends RecyclerView.Adapter<OrderHistoryAdapter.ViewHolder> {
    private List<Map<String, Object>> listOrderHistoryResponse;

    private Context context;

    private ItemListener listener;

    private int start;

    public OrderHistoryAdapter(Context context, List<Map<String, Object>> listOrderHistoryResponse, int start) {
        this.context = context;
        this.listOrderHistoryResponse = listOrderHistoryResponse;
    }

    public void setStart(int start) {
        this.start = start;
    }

    @Override
    public int getItemCount() {
        return listOrderHistoryResponse.size();
    }

    @NonNull
    @Override
    public OrderHistoryAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.order_history_item, parent, false);
        return new OrderHistoryAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Map<String, Object> orderHistory = listOrderHistoryResponse.get(position);
        if (orderHistory == null) {
            return;
        }

        holder.orderHairStyleNameTxt.setText(orderHistory.get("hairStyle").toString());
        holder.orderTimeTxt.setText(orderHistory.get("orderTime").toString());
        holder.orderPaymentTypeTxt.setText(orderHistory.get("paymentType").toString());
        holder.orderAmountTxt.setText(
            AppUtils.toVNNumberFormat(
                (int)(Double.parseDouble((orderHistory.get("amount").toString())))
        )+" đ");
        holder.sttTxt.setText((start+position)+"");

        Map<String, Object> hairColor = (Map<String, Object>) orderHistory.get("hairColor");
        if (hairColor != null) {
            holder.orderHairColorNameTxt.setText(AppUtils.capitalize(hairColor.get("color").toString()));
            holder.orderHairColorNameTxt.setTextColor(Color.parseColor(hairColor.get("colorCode").toString()));
        } else {
            holder.orderHairColorNameTxt.setText("Normal");
            holder.orderHairColorNameTxt.setTextColor(Color.parseColor("#111827"));
        }
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView orderCodeTxt, orderHairStyleNameTxt,
                orderHairColorNameTxt, orderTimeTxt, orderPaymentTypeTxt,
                orderAmountTxt, sttTxt;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            orderCodeTxt = itemView.findViewById(R.id.order_code_txt);
            orderHairStyleNameTxt = itemView.findViewById(R.id.order_hair_style_name_txt);
            orderHairColorNameTxt = itemView.findViewById(R.id.order_hair_color_name_txt);
            orderTimeTxt = itemView.findViewById(R.id.order_time_txt);
            orderPaymentTypeTxt = itemView.findViewById(R.id.order_payment_type_txt);
            orderAmountTxt = itemView.findViewById(R.id.order_amount_txt);
            sttTxt = itemView.findViewById(R.id.stt_txt);

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
