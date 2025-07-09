/**
 * Footer Component
 * Complete site navigation and information
 */

import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = {
    about: [
      { name: 'Our Mission', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Impact Report', href: '/impact' },
      { name: 'Careers', href: '/careers' },
    ],
    programs: [
      { name: 'Health & Nutrition', href: '/programs/health' },
      { name: 'Education', href: '/programs/education' },
      { name: 'Emergency Aid', href: '/programs/emergency' },
      { name: 'All Programs', href: '/programs' },
    ],
    getInvolved: [
      { name: 'Volunteer', href: '/volunteer' },
      { name: 'Donate', href: '/donate' },
      { name: 'Campaigns', href: '/campaigns' },
      { name: 'Events', href: '/events' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'News', href: '/news' },
      { name: 'Resources', href: '/resources' },
      { name: 'Contact', href: '/contact' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/givsociety',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/givsociety',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/givsociety',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.897-.875-1.387-2.026-1.387-3.323s.49-2.448 1.297-3.323c.875-.897 2.026-1.387 3.323-1.387s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/givsociety',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/givsociety',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-theme-background border-t border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-theme-primary rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-theme-primary">GIV Society</h3>
                  <p className="text-sm text-theme-muted">Kind Hearts, Healing Hands</p>
                </div>
              </div>

              <p className="text-theme-muted leading-relaxed">
                Empowering Ethiopian communities through healthcare, education, and emergency aid.
                Join us in making a lasting difference in the lives of those who need it most.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map(social => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-theme-surface rounded-lg flex items-center justify-center text-theme-muted hover:text-theme-primary hover:bg-theme-primary hover:text-white transition-all duration-300 border border-theme"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* About Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-theme-primary">About</h4>
              <ul className="space-y-3">
                {footerLinks.about.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-theme-primary">Programs</h4>
              <ul className="space-y-3">
                {footerLinks.programs.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Involved Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-theme-primary">Get Involved</h4>
              <ul className="space-y-3">
                {footerLinks.getInvolved.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-theme-primary">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-theme grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h5 className="font-semibold text-theme-primary">Email</h5>
              <p className="text-theme-muted">info@givsociety.org</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-theme-primary">Phone</h5>
              <p className="text-theme-muted">+1 (555) 123-4567</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-theme-primary">Address</h5>
              <p className="text-theme-muted">Addis Ababa, Ethiopia</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-theme flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-theme-muted text-sm">
                © {new Date().getFullYear()} GIV Society Ethiopia. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a
                  href="/privacy"
                  className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookies"
                  className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
                >
                  Cookie Policy
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-theme-muted">
              <span>Made with</span>
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>for humanity</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
