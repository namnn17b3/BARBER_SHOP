import { Schema, Document } from 'mongoose';

export const HairStyleSchema = new Schema(
  {
    id: Number,
    name: String,
    normalizedName: String,
    description: String,
    price: Number,
    active: Boolean,
    imgs: [
      {
        id: Number,
        url: String,
      },
    ],
    discount: {
      value: Number,
      unit: String,
    },
  },
  {
    timestamps: true,
    collection: 'hair_style',
  },
);

export interface HairStyle extends Document {
  id: Number;
  name: String;
  normalizedName: String;
  description: String;
  price: Number;
  active: Boolean;
  imgs: [
    {
      id: Number;
      url: String;
    },
  ];
  discount: {
    value: Number;
    unit: String;
  };
}
