import { getStore } from "@/lib/api/storefront";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export async function generateMetadata() {
  const storeRes = await getStore();
  const store = storeRes?.data;
  return {
    title: `Contact Us | ${store?.name || "Apex Cart"}`,
    description: `Get in touch with customer support at ${store?.name || "Apex Cart"}.`,
  };
}

export default async function ContactPage() {
  const storeRes = await getStore();
  const store = storeRes?.data;

  return (
    <div className="container-custom py-6 sm:py-12 max-w-5xl space-y-8">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          Have an inquiry regarding an order, size guide, or product availability? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-4">
        {/* Contact Info Card */}
        <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-text uppercase tracking-wider pb-3 border-b border-border">
            Customer Support Channels
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-text-muted">
            {store?.contact?.phone && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-text block">Hotline Support</strong>
                  <a href={`tel:${store.contact.phone}`} className="hover:text-secondary font-semibold">
                    {store.contact.phone}
                  </a>
                </div>
              </div>
            )}

            {store?.contact?.email && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-text block">Email Inquiries</strong>
                  <a href={`mailto:${store.contact.email}`} className="hover:text-secondary">
                    {store.contact.email}
                  </a>
                </div>
              </div>
            )}

            {store?.contact?.address && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-text block">Headquarters & Showroom</strong>
                  <p className="leading-snug">{store.contact.address}</p>
                </div>
              </div>
            )}

            {store?.contact?.hours && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-text block">Support Hours</strong>
                  <p>{store.contact.hours}</p>
                </div>
              </div>
            )}
          </div>

          {store?.whatsapp && (
            <div className="pt-4 border-t border-border">
              <a
                href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-theme bg-[#25D366] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          )}
        </div>

        {/* Message Form */}
        <div className="p-6 sm:p-8 rounded-theme bg-surface border border-border/80 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-text uppercase tracking-wider pb-3 border-b border-border">
            Send Us a Message
          </h2>

          <form className="space-y-4">
            <Input label="Your Name" placeholder="e.g. Asif Mahmud" required />
            <Input label="Mobile Number" placeholder="017XXXXXXXX" type="tel" required />
            <Input label="Email Address (Optional)" placeholder="asif@example.com" type="email" />

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                Message / Inquiry
              </label>
              <textarea
                rows={4}
                placeholder="How can we assist you today?"
                required
                className="w-full p-3 rounded-theme border border-border bg-surface text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button type="button" variant="primary" size="lg" className="w-full font-bold">
              Submit Inquiry
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
