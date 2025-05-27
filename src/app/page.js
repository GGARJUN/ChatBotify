"use client";
import amplify from "@/lib/config/amplify";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { Amplify } from "aws-amplify";



Amplify.configure(amplify, {
  ssr: true // Important for Next.js
});
export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
}
