import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Are your products authentic?",
    answer:
      "Absolutely, all products are sourced from trusted vendors and are 100% authentic.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept COD, UPI, debit cards, credit cards and digital wallets.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are usually delivered within 20–30 minutes depending on your location.",
  },
  {
    question: "Can I return or exchange items?",
    answer:
      "Yes, we provide hassle-free returns if the product is damaged or incorrect.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You can track your order in the 'My Orders' section of your account.",
  },
  {
    question: "Is there a warranty on your products?",
    answer:
      "Yes, we offer a warranty on most of our products. Please check the product description for warranty details.",
  },
];

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">FAQs</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl border shadow-sm p-4">
            <button
              onClick={() => toggleFaq(index)}
              className="flex justify-between items-center w-full text-left"
            >
              <span className="font-semibold text-gray-800">
                {faq.question}
              </span>

              {openIndex === index ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {openIndex === index && (
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
