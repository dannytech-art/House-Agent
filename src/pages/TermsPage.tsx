import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function TermsPage() {
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              Terms of Service
            </h1>
          </div>

          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="lead text-xl text-text-primary mb-8">
              Welcome to Vilanow. By using our platform, you agree to these
              terms. Please read them carefully.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing or using the Vilanow platform, you agree to be
                bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                2. User Accounts
              </h2>
              <p className="mb-4">
                To access certain features of the platform, you must register
                for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  Provide accurate, current, and complete information during
                  registration
                </li>
                <li>
                  Maintain the security of your password and accept all risks of
                  unauthorized access
                </li>
                <li>
                  Notify us immediately if you discover or suspect any security
                  breaches
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                3. Agent Responsibilities
              </h2>
              <p className="mb-4">Agents on Vilanow must:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Complete the KYC verification process</li>
                <li>Provide accurate property details and images</li>
                <li>
                  Respond to inquiries in a timely and professional manner
                </li>
                <li>Comply with all local real estate laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                4. Fees and Payments
              </h2>
              <p className="mb-4">
                Vilanow operates on a credit-based system. Credits purchased are
                non-refundable unless otherwise required by law. We reserve the
                right to change our pricing and credit system at any time with
                notice to users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                5. Limitation of Liability
              </h2>
              <p className="mb-4">
                Vilanow is a platform connecting seekers and agents. We do not
                own, sell, or manage properties. We are not liable for any
                disputes, losses, or damages arising from transactions between
                users.
              </p>
            </section>

            <div className="mt-12 p-6 bg-bg-secondary rounded-xl border border-border-color">
              <p className="text-sm text-text-tertiary">
                Last updated: January 20, 2024. If you have any questions about
                these Terms, please contact us at legal@vilanow.com.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
}