package com.example.barbershop.adapters;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.barbershop.R;
import com.example.barbershop.utils.AppUtils;

import java.util.List;
import java.util.Map;

public class ReviewAdapter extends RecyclerView.Adapter<ReviewAdapter.ViewHolder> {
    private List<Map<String, Object>> listReviewResponse;

    private Context context;

    private ReviewAdapter.ItemListener listener;

    public ReviewAdapter(Context context, List<Map<String, Object>> listReviewResponse) {
        this.context = context;
        this.listReviewResponse = listReviewResponse;
    }

    @Override
    public int getItemCount() {
        return listReviewResponse.size();
    }

    @NonNull
    @Override
    public ReviewAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.review_item, parent, false);
        return new ReviewAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ReviewAdapter.ViewHolder holder, int position) {
        Map<String, Object> review = listReviewResponse.get(position);
        if (review == null) {
            return;
        }

        holder.reviewComment.setText(review.get("comment").toString());
        holder.reviewDateTime.setText(review.get("time").toString());
        holder.reviewStar.setRating(Float.parseFloat(review.get("star")+""));

        Map<String, Object> user = (Map<String, Object>) review.get("user");
        holder.reviewUsername.setText(user.get("username").toString());
        if (user.get("avatar") != null && !user.get("avatar").toString().isEmpty()) {
            Glide.with(context).load(user.get("avatar").toString()).into(holder.reviewUserAvatar);
        } else {
//            holder.reviewUserAvatar.setBackground(ContextCompat.getDrawable(context, R.drawable.fb_no_img));
//            holder.reviewUserAvatar.setBackground(context.getResources().getDrawable(R.drawable.fb_no_img));
            Glide.with(context).load(R.drawable.fb_no_img).into(holder.reviewUserAvatar);
        }

        Map<String, Object> hairColor = (Map<String, Object>) user.get("hairColor");
        if (hairColor != null) {
            holder.reviewHairColor.setText(AppUtils.capitalize(hairColor.get("color").toString()));
            holder.reviewHairColor.setTextColor(Color.parseColor(hairColor.get("colorCode").toString()));
        }

        if (position == listReviewResponse.size() - 1) {
            holder.hrView.setVisibility(View.GONE);
            int padding = holder.item.getPaddingTop();
            holder.item.setPadding(padding, padding, padding, padding);
        } else {
            holder.hrView.setVisibility(View.VISIBLE);
        }
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView reviewUserAvatar;
        RatingBar reviewStar;
        TextView reviewUsername, reviewHairColor, reviewDateTime, reviewComment;
        View hrView;
        View item;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            item = itemView;

            reviewUsername = itemView.findViewById(R.id.review_user_name);
            reviewHairColor = itemView.findViewById(R.id.review_hair_color);
            reviewDateTime = itemView.findViewById(R.id.review_date_time);
            reviewComment = itemView.findViewById(R.id.review_comment);
            reviewUserAvatar = itemView.findViewById(R.id.review_user_img);
            reviewStar = itemView.findViewById(R.id.review_star);
            hrView = itemView.findViewById(R.id.hr_view);

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

    public void setItemClickListener(ReviewAdapter.ItemListener listener) {
        this.listener = listener;
    }

    public interface ItemListener {
        void onClickItemListener(View view, int position);
    }
}

