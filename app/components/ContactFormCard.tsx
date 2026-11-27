'use client';

import { useState } from 'react';

/* Same form + same APIs as the home-page contact form (HeroFormSection),
   packaged as a standalone card so landing pages can embed it. */

type Props = {
  /** Pre-selected value of the "Project/Services" dropdown */
  defaultProject?: string;
  /** Label sent to the Retell call API so the team knows where the lead came from */
  source?: string;
};

const SELECT_ARROW =
  'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")';

const selectStyle: React.CSSProperties = {
  backgroundImage: SELECT_ARROW,
  backgroundPosition: 'right 0.5rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1.5em 1.5em',
  paddingRight: '2.5rem',
};

const FIELD =
  "w-full px-3 py-2.5 border border-gray-300 rounded-[8px] font-['Poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe02] focus:border-transparent transition-all duration-200 bg-white";
const LABEL = "block font-['Poppins'] font-medium text-sm text-[#1A1A1A] mb-1";

const ContactFormCard = ({ defaultProject = '', source = 'Contact Form' }: Props) => {
  const initial = { name: '', email: '', contact: '', project: defaultProject, budget: '' };
  const [formData, setFormData] = useState(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatProject = (value: string) => {
    if (!value) return 'Not specified';
    return value
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const emailRes = await fetch('/api/send-email-resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: formData.name,
          from_email: formData.email,
          contact_number: formData.contact || 'Not provided',
          project_service: formatProject(formData.project),
          budget: formData.budget || 'No budget specified',
        }),
      });
      if (emailRes.status === 429) {
        const data = await emailRes.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ||
            'Submission limit reached. You can submit up to 3 times per day from this network.',
        );
      }
      if (!emailRes.ok) throw new Error('Could not submit form. Please try again later.');

      if (formData.contact) {
        try {
          await fetch('/api/retell/call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to_number: formData.contact,
              customer_name: formData.name,
              customer_email: formData.email,
              service: formData.project,
              budget: formData.budget,
              source,
            }),
          });
        } catch (callError) {
          console.error('Retell call trigger failed:', callError);
        }
      }

      setStatus('success');
      setFormData(initial);
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMsg(error instanceof Error ? error.message : '');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-yellow-400 rounded-[24px] p-6 sm:p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="btf-name" className={LABEL}>Full Name *</label>
          <input id="btf-name" name="name" type="text" required value={formData.name} onChange={handleChange} className={FIELD} placeholder="Enter your full name" />
        </div>

        <div>
          <label htmlFor="btf-email" className={LABEL}>Email Address *</label>
          <input id="btf-email" name="email" type="email" required value={formData.email} onChange={handleChange} className={FIELD} placeholder="Enter your email address" />
        </div>

        <div>
          <label htmlFor="btf-contact" className={LABEL}>Contact Number *</label>
          <input id="btf-contact" name="contact" type="tel" required value={formData.contact} onChange={handleChange} className={FIELD} placeholder="Enter your contact number" />
        </div>

        <div>
          <label htmlFor="btf-project" className={LABEL}>Project/Services *</label>
          <select id="btf-project" name="project" required value={formData.project} onChange={handleChange} className={`${FIELD} appearance-none`} style={selectStyle}>
            <option value="">Select a project/service</option>
            <option value="ghost writing">Ghost Writing</option>
            <option value="publishing">Publishing</option>
            <option value="editing">Editing</option>
            <option value="marketing">Marketing</option>
            <option value="distribution">Distribution</option>
            <option value="printing">Printing</option>
            <option value="book to youtube">Book to YouTube</option>
            <option value="book to film">Book to Film / Animated Series</option>
          </select>
        </div>

        <div>
          <label htmlFor="btf-budget" className={LABEL}>Budget (Optional)</label>
          <select id="btf-budget" name="budget" value={formData.budget} onChange={handleChange} className={`${FIELD} appearance-none`} style={selectStyle}>
            <option value="">Select budget range</option>
            <option value="Under $500">Under $500</option>
            <option value="$500 - $1,000">$500 - $1,000</option>
            <option value="$1,000 - $2,500">$1,000 - $2,500</option>
            <option value="$2,500 - $5,000">$2,500 - $5,000</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="Over $10,000">Over $10,000</option>
            <option value="Let's discuss">Let&apos;s discuss</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-['Poppins'] font-semibold px-4 py-3 rounded-[40px] text-sm transition-all duration-200 flex items-center justify-center"
        >
          {isSubmitting ? 'Sending...' : 'Get Started'}
        </button>

        {status === 'success' && (
          <div className="p-2 bg-green-100 border border-green-400 text-green-700 rounded-[8px] font-['Poppins'] text-sm">
            Thank you! Your message has been sent. We&apos;ll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded-[8px] font-['Poppins'] text-sm">
            {errorMsg || 'There was an error sending your message. Please try again.'}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactFormCard;
