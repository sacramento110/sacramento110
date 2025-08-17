import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Facebook, Youtube, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SSMA_INFO } from '@/utils/constants';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would integrate with your newsletter service
      // For now, we'll just simulate success
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const socialMedia = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: SSMA_INFO.facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      followers: '2.5K+'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: SSMA_INFO.youtube,
      color: 'bg-red-600 hover:bg-red-700',
      followers: '1.8K+'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: SSMA_INFO.instagram || '#',
      color: 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      followers: '800+'
    }
  ];

  return (
    <section id="newsletter" className="py-20 bg-gradient-to-br from-islamic-navy-900 to-islamic-navy-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Newsletter Signup */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Mail className="w-8 h-8 text-islamic-gold-400" />
              <h2 className="text-4xl md:text-5xl font-bold">Stay Connected</h2>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Subscribe to our weekly newsletter and never miss important community 
              updates, event announcements, and spiritual reminders.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-islamic-gold-500"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-islamic-gold-600 hover:bg-islamic-gold-700 text-white px-8 py-3"
                    icon={isLoading ? undefined : Send}
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                
                <p className="text-sm text-gray-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            ) : (
              <Card className="bg-islamic-green-600 border-islamic-green-500 p-6">
                <div className="flex items-center space-x-3 text-white">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Successfully Subscribed!</h3>
                    <p className="text-islamic-green-100 text-sm">
                      Thank you for joining our community newsletter.
                    </p>
                  </div>
                </div>
              </Card>
            )}


          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-center">Follow Us</h3>
            <p className="text-gray-300 text-center mb-8">
              Connect with us on social media for daily updates and community highlights
            </p>

            <div className="space-y-4">
              {socialMedia.map((platform) => (
                <Card
                  key={platform.name}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center transition-colors`}>
                        <platform.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-islamic-gold-400 transition-colors">
                          {platform.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {platform.followers} followers
                        </p>
                      </div>
                    </div>
                    <div className="text-white group-hover:text-islamic-gold-400 transition-colors">
                      Follow →
                    </div>
                  </a>
                </Card>
              ))}
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};
