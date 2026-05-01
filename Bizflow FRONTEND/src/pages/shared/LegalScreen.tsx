import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { ChevronLeft, FileText, Shield } from 'lucide-react';

const LegalScreen = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const isTerms = type === 'terms';

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-coffee-600 hover:text-coffee-700 transition-standard">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl">{isTerms ? 'Terms and Conditions' : 'Privacy Policy'}</h2>
            <p className="text-neutral-500 text-xs">Last updated: April 2026</p>
          </div>
        </div>

        <Card className="prose prose-sm max-w-none p-8 space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-coffee-700/10 flex items-center justify-center text-coffee-700">
              {isTerms ? <FileText size={32} /> : <Shield size={32} />}
            </div>
          </div>

          {isTerms ? (
            <div className="space-y-6 text-coffee-600 text-sm leading-relaxed">
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">1. Acceptance of Terms</h3>
                <p>By accessing and using BizFlow, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the service.</p>
              </section>
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">2. Description of Service</h3>
                <p>BizFlow provides a cloud-based business management platform for service-based businesses, including queue management, appointment scheduling, and financial tracking.</p>
              </section>
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">3. User Responsibilities</h3>
                <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>
              </section>
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">4. Data Ownership</h3>
                <p>You retain all rights to the data you input into the system. BizFlow reserves the right to use anonymized, aggregated data for service improvement.</p>
              </section>
            </div>
          ) : (
            <div className="space-y-6 text-coffee-600 text-sm leading-relaxed">
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">1. Information We Collect</h3>
                <p>We collect information necessary to provide the service, including name, phone number, email, and business operational data.</p>
              </section>
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">2. How We Use Information</h3>
                <p>Your information is used to manage your account, provide technical support, and process transactions through partners like M-PESA.</p>
              </section>
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">3. Data Security</h3>
                <p>We implement industry-standard security measures, including encryption and secure hashing, to protect your personal and business data.</p>
              </section>
              <section>
                <h3 className="text-coffee-900 font-bold text-base mb-2">4. Third-Party Services</h3>
                <p>We share data with third parties only when necessary (e.g., Africa's Talking for SMS, Meta for WhatsApp, OpenAI for AI features).</p>
              </section>
            </div>
          )}
          
          <div className="pt-10 border-t border-coffee-200 text-center text-xs text-neutral-500">
            If you have any questions, please contact our support team at support@bizflow.app
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LegalScreen;
