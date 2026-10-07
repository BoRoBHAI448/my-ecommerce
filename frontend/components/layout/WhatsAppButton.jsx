"use client";

import { useStore } from "@/lib/store-context";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const store = useStore();

  if (!store?.whatsapp) {
    return null;
  }

  const cleanNumber = store.whatsapp.replace(/[^0-9]/g, "");
  const defaultText = encodeURIComponent(
    `Hello ${store.name || "Store"}, I have an inquiry regarding your products.`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="text-xs font-bold tracking-wide hidden sm:inline-block pr-1">
        WhatsApp Us
      </span>
    </a>
  );
}
