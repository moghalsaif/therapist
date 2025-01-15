'use client';

import { useState, useRef, useEffect } from 'react';
import TherapistCard from '@/components/ui/TherapistCard';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  therapists?: any[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulated AI response with therapist recommendations
      // In reality, you'd call your AI endpoint here
      const mockTherapists = [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          location: "New York, NY",
          rating: 4.9,
          specialties: ["Anxiety", "Depression"],
          languages: ["English", "Spanish"],
          session_format: "Video & In-person",
          rate: 150,
          bio: "Experienced therapist specializing in anxiety and depression.",
          email: "sarah@example.com"
        },
        {
          id: 2,
          name: "Dr. Michael Chen",
          location: "San Francisco, CA",
          rating: 4.8,
          specialties: ["Trauma", "Relationships"],
          languages: ["English", "Mandarin"],
          session_format: "Video",
          rate: 180,
          bio: "Trauma-informed therapist with 10+ years of experience.",
          email: "michael@example.com"
        }
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Based on what you\'ve shared, here are some therapists who might be able to help:',
        therapists: mockTherapists,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = (therapist: any) => {
    window.location.href = `mailto:${therapist.email}?subject=Therapy%20Session%20Inquiry`;
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{message.content}</p>
              {message.therapists && (
                <div className="mt-4 space-y-4">
                  {message.therapists.map((therapist) => (
                    <TherapistCard
                      key={therapist.id}
                      therapist={therapist}
                      onContact={() => handleContact(therapist)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what's troubling you..."
            className="flex-1 rounded-lg border border-gray-300 p-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
} 