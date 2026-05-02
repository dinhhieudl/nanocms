import { Section, SectionHeading } from '@/components/builder';
import { FAQAccordion } from '@/components/static/faq-accordion';

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about NanoCommerce.',
};

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping within Vietnam takes 2-5 business days. Express shipping is available for 1-2 day delivery in major cities.' },
  { q: 'Do you offer free shipping?', a: 'Yes! All orders over 500,000₫ qualify for free standard shipping within Vietnam.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unworn items in original packaging. Contact us to initiate a return.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with tracking information. You can also check order status in your account.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), bank transfers, and major credit/debit cards.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship within Vietnam. International shipping is coming soon!' },
  { q: 'How do I know what size to order?', a: 'Each product page includes a detailed size guide. If you\'re between sizes, we recommend sizing up for a relaxed fit.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support team.' },
];

export default function FAQPage() {
  return (
    <Section className="py-12 md:py-20">
      <SectionHeading title="Frequently Asked Questions" subtitle="Find answers to common questions" />
      <div className="max-w-3xl mx-auto mt-12">
        <FAQAccordion items={faqs} />
      </div>
    </Section>
  );
}
