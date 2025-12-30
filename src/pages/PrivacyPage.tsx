import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function PrivacyPage() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-bg-primary pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              Privacy Policy
            </h1>
          </div>

          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="lead text-xl text-text-primary mb-8">
              Your privacy is important to us. This policy outlines how we
              collect, use, and protect your personal information.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Account information (name, email, phone number)</li>
                <li>Profile information (avatar, bio, preferences)</li>
                <li>Property details and search history</li>
                <li>Communications with other users</li>
                <li>
                  Payment transaction data (processed securely by third-party
                  providers)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Match seekers with relevant properties and agents</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                3. Data Sharing
              </h2>
              <p className="mb-4">
                We do not sell your personal data. We may share your information
                with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Agents or seekers you choose to interact with</li>
                <li>
                  Service providers who assist our operations (e.g., payment
                  processors)
                </li>
                <li>Law enforcement when required by applicable law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                4. Data Security
              </h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. However, no internet
                transmission is completely secure.
              </p>
            </section>

            <div className="mt-12 p-6 bg-bg-secondary rounded-xl border border-border-color">
              <p className="text-sm text-text-tertiary">
                Last updated: January 20, 2024. If you have any questions about
                this Privacy Policy, please contact us at privacy@vilanow.com.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
}