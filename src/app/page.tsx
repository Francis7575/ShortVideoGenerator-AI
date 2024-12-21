'use client';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/sign-in');
    } else {
      router.replace('/dashboard');
    }
  }, [user, router]);
}