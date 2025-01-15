'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    genderIdentity: '',
    location: '',
    culturalBackground: '',
    preferredLanguage: '',
    lgbtqIdentity: '',
    relationshipStatus: '',
    hasChildren: '',
    occupation: '',
    mentalHealthConditions: [] as string[],
    medications: '',
    communicationStyle: [] as string[],
    religiousBeliefs: '',
    sessionFormat: '',
    insurance: '',
    budget: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userPreferences', JSON.stringify(formData));
    router.push('/chat');
  };

  const handleCheckboxChange = (field: 'mentalHealthConditions' | 'communicationStyle', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Help us understand your needs</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium">Age</label>
          <input
            id="age"
            type="number"
            min="13"
            max="120"
            value={formData.age}
            onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium">Gender Identity</label>
          <select
            id="gender"
            value={formData.genderIdentity}
            onChange={e => setFormData(prev => ({ ...prev, genderIdentity: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Select gender identity</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="transgender">Transgender</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">Location</label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            placeholder="City, State"
            required
          />
        </div>

        <div>
          <label htmlFor="background" className="block text-sm font-medium">Cultural Background</label>
          <input
            id="background"
            type="text"
            value={formData.culturalBackground}
            onChange={e => setFormData(prev => ({ ...prev, culturalBackground: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium">Preferred Language</label>
          <select
            id="language"
            value={formData.preferredLanguage}
            onChange={e => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Select language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Hindi">Hindi</option>
            <option value="Arabic">Arabic</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="lgbtq" className="block text-sm font-medium">LGBTQ+ Identity</label>
          <select
            id="lgbtq"
            value={formData.lgbtqIdentity}
            onChange={e => setFormData(prev => ({ ...prev, lgbtqIdentity: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
          >
            <option value="">Select identity (optional)</option>
            <option value="lesbian">Lesbian</option>
            <option value="gay">Gay</option>
            <option value="bisexual">Bisexual</option>
            <option value="transgender">Transgender</option>
            <option value="queer">Queer</option>
            <option value="questioning">Questioning</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label htmlFor="relationship" className="block text-sm font-medium">Relationship Status</label>
          <select
            id="relationship"
            value={formData.relationshipStatus}
            onChange={e => setFormData(prev => ({ ...prev, relationshipStatus: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="in-relationship">In a relationship</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="children" className="block text-sm font-medium">Do you have children?</label>
          <select
            id="children"
            value={formData.hasChildren}
            onChange={e => setFormData(prev => ({ ...prev, hasChildren: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Select option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="occupation" className="block text-sm font-medium">Occupation</label>
          <input
            id="occupation"
            type="text"
            value={formData.occupation}
            onChange={e => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mental Health Conditions</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              'Anxiety',
              'Depression',
              'PTSD',
              'OCD',
              'Bipolar Disorder',
              'Eating Disorders',
              'ADHD',
              'Substance Use',
              'Grief',
              'Trauma',
              'Relationship Issues',
              'Self-esteem',
              'Stress',
              'Other'
            ].map(condition => (
              <label key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.mentalHealthConditions.includes(condition)}
                  onChange={() => handleCheckboxChange('mentalHealthConditions', condition)}
                  className="h-4 w-4 rounded border"
                />
                <span className="ml-2 text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="medications" className="block text-sm font-medium">Current Medications</label>
          <textarea
            id="medications"
            value={formData.medications}
            onChange={e => setFormData(prev => ({ ...prev, medications: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            placeholder="List any current medications (optional)"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Communication Style</label>
          <div className="mt-2 space-y-2">
            {[
              'Direct and straightforward',
              'Gentle and supportive',
              'Analytical and logical',
              'Solution-focused',
              'Emotion-focused',
              'Mix of approaches'
            ].map(style => (
              <label key={style} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.communicationStyle.includes(style)}
                  onChange={() => handleCheckboxChange('communicationStyle', style)}
                  className="h-4 w-4 rounded border"
                />
                <span className="ml-2 text-sm">{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="beliefs" className="block text-sm font-medium">Religious/Spiritual Beliefs</label>
          <input
            id="beliefs"
            type="text"
            value={formData.religiousBeliefs}
            onChange={e => setFormData(prev => ({ ...prev, religiousBeliefs: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            placeholder="Optional"
          />
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium">Preferred Session Format</label>
          <select
            id="format"
            value={formData.sessionFormat}
            onChange={e => setFormData(prev => ({ ...prev, sessionFormat: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Select format</option>
            <option value="in-person">In-person</option>
            <option value="video">Video</option>
            <option value="phone">Phone</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div>
          <label htmlFor="insurance" className="block text-sm font-medium">Insurance Provider</label>
          <input
            id="insurance"
            type="text"
            value={formData.insurance}
            onChange={e => setFormData(prev => ({ ...prev, insurance: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            placeholder="Optional"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium">Budget per Session</label>
          <select
            id="budget"
            value={formData.budget}
            onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            className="mt-1 block w-full rounded-md border p-2"
            required
          >
            <option value="">Select budget range</option>
            <option value="50-100">$50-$100</option>
            <option value="100-150">$100-$150</option>
            <option value="150-200">$150-$200</option>
            <option value="200+">$200+</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Continue to Chat
        </button>
      </form>
    </div>
  );
} 