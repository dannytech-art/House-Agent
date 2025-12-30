import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ChevronDown, MessageCircle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const faqs = [{
    id: '1',
    question: 'How do I verify my agent account?',
    answer: 'To verify your account, go to your profile and click on "Complete KYC". You will need to upload a valid government ID and provide your professional license number if applicable. Verification typically takes 24-48 hours.'
  }, {
    id: '2',
    question: 'How does the credit system work?',
    answer: 'Credits are used to perform premium actions on Vilanow, such as unlocking direct leads, boosting listings, or claiming territories. You can purchase credits in bundles from your Wallet page.'
  }, {
    id: '3',
    question: 'Is Vilanow free for house seekers?',
    answer: 'Yes! Searching for properties and contacting agents is completely free for house seekers. We only charge agents for premium features and lead generation tools.'
  }, {
    id: '4',
    question: 'How do I report a suspicious listing?',
    answer: 'If you encounter a suspicious listing, please click the "Report" button on the property details page. Our trust and safety team will investigate immediately.'
  }, {
    id: '5',
    question: 'Can I list properties in multiple locations?',
    answer: 'Yes, agents can list properties in any location. However, claiming a "Territory" gives you specific advantages and analytics for that area.'
  }];
  const filteredFaqs = faqs.filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="min-h-screen bg-bg-primary pb-20">
      <div className="bg-bg-secondary border-b border-border-color py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <button onClick={() => navigate(-1)} className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
            How can we help you?
          </h1>
          <p className="text-text-secondary mb-8">
            Search our knowledge base or get in touch with support
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search for answers..." className="w-full pl-12 pr-4 py-4 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFaqs.map(faq => <div key={faq.id} className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-tertiary transition-colors">
                  <span className="font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} className="overflow-hidden">
                      <div className="p-4 pt-0 text-text-secondary text-sm border-t border-border-color/50">
                        <div className="pt-4">{faq.answer}</div>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>)}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            Still need help?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="mailto:support@vilanow.com" className="p-6 bg-bg-secondary border border-border-color rounded-xl text-center hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-text-primary mb-1">
                Email Support
              </h3>
              <p className="text-xs text-text-tertiary">Response within 24h</p>
            </a>

            <button className="p-6 bg-bg-secondary border border-border-color rounded-xl text-center hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-text-primary mb-1">Live Chat</h3>
              <p className="text-xs text-text-tertiary">Available 9am - 5pm</p>
            </button>

            <a href="tel:+2348000000000" className="p-6 bg-bg-secondary border border-border-color rounded-xl text-center hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-bg-primary transition-colors">
                <Phone className="w-6 h-6 text-text-secondary" />
              </div>
              <h3 className="font-bold text-text-primary mb-1">Phone</h3>
              <p className="text-xs text-text-tertiary">Mon-Fri, 9am - 5pm</p>
            </a>
          </div>
        </div>
      </div>
    </div>;
}