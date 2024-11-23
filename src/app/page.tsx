'use client';
import { redirect, RedirectType } from 'next/navigation';

export default function Home() {
  redirect('/dashboard', RedirectType.replace);
}