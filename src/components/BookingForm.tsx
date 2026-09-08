import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

// Helper to decode email address to prevent scraping bots from harvesting it from source code
const getEmailAddress = (): string => {
  try {
    return atob("Ym9va2luZ0BkamhvdHNvbmcuY29t");
  } catch (e) {
    return "booking" + "@" + "djhotsong.com";
  }
};

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error for field
    if (errors[id]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.eventType) newErrors.eventType = "Please select an event type";
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const emailSubject = encodeURIComponent(`DJ Hotsong Booking Request: ${formData.eventType.toUpperCase()} - ${formData.date}`);
    const emailBody = encodeURIComponent(
      `Hi Emilio / DJ Hotsong,\n\n` +
      `I would like to request a booking for an upcoming event:\n\n` +
      `• Name: ${formData.name}\n` +
      `• Email: ${formData.email}\n` +
      `• Phone: ${formData.phone || "Not provided"}\n` +
      `• Event Type: ${formData.eventType.toUpperCase()}\n` +
      `• Proposed Date: ${formData.date}\n\n` +
      `• Details / Message:\n${formData.message || "No additional message provided."}\n\n` +
      `Best regards,\n` +
      `${formData.name}`
    );

    // Simulate sending of request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Trigger the local mail client pre-filled to the obfuscated email address
      window.location.href = `mailto:${getEmailAddress()}?subject=${emailSubject}&body=${emailBody}`;

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        date: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="bg-surface-container-high rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
      {/* Decorative glowing orb */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full filter blur-[120px] opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg relative z-10"
          >
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
                Elevate Your <br />
                <span className="text-primary">Next Event</span>
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Ready to bring the heat? Get in touch to check availability and discuss custom live setups, sound requirements, and tracklists for your venue or private event.
              </p>

              <div className="flex flex-col gap-5">
                <a
                  className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group"
                  href="tel:+353833432080"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary">phone_iphone</span>
                  </div>
                  <span className="font-body-lg text-body-lg">+353.83.343.2080</span>
                </a>
                <a
                  className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group"
                  href={`mailto:${getEmailAddress()}`}
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary">mail</span>
                  </div>
                  <span className="font-body-lg text-body-lg">{getEmailAddress()}</span>
                </a>
                <a
                  className="flex items-center gap-4 text-on-surface hover:text-primary transition-colors group"
                  href="https://www.instagram.com/ehotsong?igsh=YTV5YnJlaDl6ejE2&igsi=YTV5YnJlaDl6ejE2&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary">photo_camera</span>
                  </div>
                  <span className="font-body-lg text-body-lg">@ehotsong</span>
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name Field */}
              <div>
                <label
                  className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                  htmlFor="name"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full bg-transparent border-b ${
                    errors.name ? "border-error focus:border-error" : "border-white/20 focus:border-primary"
                  } border-t-0 border-l-0 border-r-0 focus:ring-0 px-0 py-3 text-on-surface font-body-md transition-colors placeholder-white/30`}
                />
                {errors.name && <p className="text-error text-xs mt-1 font-mono">{errors.name}</p>}
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                    htmlFor="email"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full bg-transparent border-b ${
                      errors.email ? "border-error focus:border-error" : "border-white/20 focus:border-primary"
                    } border-t-0 border-l-0 border-r-0 focus:ring-0 px-0 py-3 text-on-surface font-body-md transition-colors placeholder-white/30`}
                  />
                  {errors.email && <p className="text-error text-xs mt-1 font-mono">{errors.email}</p>}
                </div>
                <div>
                  <label
                    className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+353 8X XXX XXXX"
                    className="w-full bg-transparent border-b border-white/20 focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 px-0 py-3 text-on-surface font-body-md transition-colors placeholder-white/30"
                  />
                </div>
              </div>

              {/* Event Type & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                    htmlFor="eventType"
                  >
                    Event Type *
                  </label>
                  <select
                    id="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className={`w-full bg-transparent border-b ${
                      errors.eventType ? "border-error focus:border-error" : "border-white/20 focus:border-primary"
                    } border-t-0 border-l-0 border-r-0 focus:ring-0 px-0 py-3 text-on-surface font-body-md transition-colors appearance-none`}
                  >
                    <option value="" disabled className="bg-surface-container text-white/40">
                      Select type...
                    </option>
                    <option value="club" className="bg-surface-container text-on-surface">Club Night</option>
                    <option value="private" className="bg-surface-container text-on-surface">Private Party</option>
                    <option value="corporate" className="bg-surface-container text-on-surface">Corporate Event</option>
                    <option value="festival" className="bg-surface-container text-on-surface">Festival</option>
                  </select>
                  {errors.eventType && <p className="text-error text-xs mt-1 font-mono">{errors.eventType}</p>}
                </div>

                <div>
                  <label
                    className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                    htmlFor="date"
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full bg-transparent border-b ${
                      errors.date ? "border-error focus:border-error" : "border-white/20 focus:border-primary"
                    } border-t-0 border-l-0 border-r-0 focus:ring-0 px-0 py-3 text-on-surface font-body-md transition-colors`}
                  />
                  {errors.date && <p className="text-error text-xs mt-1 font-mono">{errors.date}</p>}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details about your crowd, theme, and music preferences..."
                  rows={2}
                  className="w-full bg-transparent border-b border-white/20 focus:border-primary border-t-0 border-l-0 border-r-0 focus:ring-0 px-0 py-3 text-on-surface font-body-md transition-colors placeholder-white/30 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-primary text-on-primary px-8 py-4 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 glow-primary self-start inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-on-primary border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center relative z-10"
          >
            <div className="w-20 h-20 bg-secondary-container/20 text-secondary-container border border-secondary-container rounded-full flex items-center justify-center mb-6 animate-bounce">
              <span className="material-symbols-outlined text-4xl">celebration</span>
            </div>
            <h3 className="font-headline-lg text-3xl text-on-surface mb-3">
              Request Sent Successfully!
            </h3>
            <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
              ¡Fuego! Thank you for reaching out. Emilio will review the date and contact you within 24 hours to set Dublin on fire!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 glow-primary cursor-pointer"
            >
              New Request
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
