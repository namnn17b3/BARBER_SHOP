import HomePage from "@/components/HomePage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: 'Barber Shop',
};

export default function Home() {
  return (
    <HomePage />
  );
}
