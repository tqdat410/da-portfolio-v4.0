import { render, screen } from '@testing-library/react';
import { Contact } from './Contact';
import '@testing-library/jest-dom';

// Mock the next-intl useTranslations hook for the Contact section
jest.mock('next-intl', () => ({
  useTranslations: (namespace) => {
    const commonTranslations = {
      'Contact.title': 'Get In Touch',
      'Contact.description': 'Have a question or want to work together? Send me a message!',
      'Contact.emailLabel': 'Email',
      'Contact.email': 'test@example.com',
      'Contact.phoneLabel': 'Phone',
      'Contact.phone': '+1234567890',
      'Contact.cta': 'Connect with me on social media:',
      'SocialLinks.github': 'https://github.com/testuser',
      'SocialLinks.linkedin': 'https://linkedin.com/in/testuser',
      'SocialLinks.gmail': 'mailto:test@example.com',
      'SocialLinks.facebook': 'https://facebook.com/testuser',
      'SocialLinks.telegram': 'https://t.me/testuser',
      'SocialLinks.discord': 'https://discord.com/testuser',
    };

    const t = (key) => {
      const namespacedKey = namespace ? `${namespace}.${key}` : key;
      return commonTranslations[namespacedKey] || key;
    };
    t.raw = (key) => {
      const namespacedKey = namespace ? `${namespace}.${key}` : key;
      return commonTranslations[namespacedKey];
    };
    return t;
  },
}));

describe('Contact Section', () => {
  it('renders the Contact section title and description', () => {
    render(<Contact />);
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    expect(screen.getByText('Have a question or want to work together? Send me a message!')).toBeInTheDocument();
  });

  it('renders contact information (email and phone)', () => {
    render(<Contact />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'test@example.com' })).toHaveAttribute('href', 'mailto:test@example.com');

    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+1234567890' })).toHaveAttribute('href', 'tel:+1234567890');
  });

  it('renders social links with correct attributes', () => {
    render(<Contact />);
    expect(screen.getByText('Connect with me on social media:')).toBeInTheDocument();

    const githubLink = screen.getByLabelText('github');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/testuser');

    const linkedinLink = screen.getByLabelText('linkedin');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/testuser');

    // Test a social link that renders initials because it's not in SOCIAL_ICONS
    const gmailLink = screen.getByLabelText('gmail');
    expect(gmailLink).toBeInTheDocument();
    expect(gmailLink).toHaveAttribute('href', 'mailto:test@example.com');
    expect(screen.getByText('gm')).toBeInTheDocument(); // Expecting initials for gmail
  });
});
