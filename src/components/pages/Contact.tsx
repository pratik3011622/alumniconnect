import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <MessageCircle className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <ContactInfoCard
            icon={<Mail className="w-8 h-8 text-blue-600" />}
            title="Email Us"
            content="alumni@university.edu"
            description="We'll respond within 24 hours"
          />
          <ContactInfoCard
            icon={<Phone className="w-8 h-8 text-green-600" />}
            title="Call Us"
            content="+1 (555) 123-4567"
            description="Mon-Fri, 9am-5pm EST"
          />
          <ContactInfoCard
            icon={<MapPin className="w-8 h-8 text-red-600" />}
            title="Visit Us"
            content="123 University Ave"
            description="City, State 12345"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center">
              <Send className="w-6 h-6 mr-3" />
              <div>
                <h3 className="font-semibold">Message sent successfully!</h3>
                <p className="text-sm">We'll get back to you as soon as possible.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center text-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <FAQItem
              question="How do I update my alumni profile?"
              answer="After logging in, navigate to your profile page and click the 'Edit Profile' button to update your information."
            />
            <FAQItem
              question="How long does alumni approval take?"
              answer="Alumni registrations are typically reviewed and approved by our admin team within 24-48 hours."
            />
            <FAQItem
              question="Can I post job opportunities?"
              answer="Yes! Once your alumni profile is approved, you can post job and internship opportunities through the Job Board."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  description: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon, title, content, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-lg text-gray-700 font-medium mb-1">{content}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{question}</h4>
      <p className="text-gray-600 text-sm">{answer}</p>
    </div>
  );
};
