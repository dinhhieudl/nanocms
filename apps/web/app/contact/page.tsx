import { Section, SectionHeading } from '@/components/builder';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with NanoCommerce. We\'d love to hear from you.',
};

export default function ContactPage() {
  return (
    <Section className="py-12 md:py-20">
      <SectionHeading title="Contact Us" subtitle="We'd love to hear from you" />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-6">
          {[
            { icon: Mail, label: 'Email', value: 'hello@nanocms.example.com', href: 'mailto:hello@nanocms.example.com' },
            { icon: Phone, label: 'Phone', value: '+84 901 234 567', href: 'tel:+84901234567' },
            { icon: MapPin, label: 'Address', value: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' },
            { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9:00 – 18:00' },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-gray-500 hover:text-brand-600">{value}</a>
                ) : (
                  <p className="text-sm text-gray-500">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <form className="card space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                <input type="text" className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input type="email" className="input-field" placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
              <input type="text" className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
              <textarea className="input-field min-h-[150px] resize-y" placeholder="Tell us more..." />
            </div>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </Section>
  );
}
