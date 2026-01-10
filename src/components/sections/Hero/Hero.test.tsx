import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import '@testing-library/jest-dom';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key) => {
      switch (key) {
        case 'status':
          return 'Mocked Status';
        case 'greeting':
          return 'Mocked Greeting';
        case 'name':
          return 'Mocked Name';
        case 'role':
          return 'Mocked Role';
        case 'description':
          return 'Mocked Description';
        case 'cta':
          return 'Mocked CTA';
        case 'downloadCv':
          return 'Download CV';
        case 'resumeUrl_en':
            return '/mocked-resume.pdf';
        default:
          return key;
      }
    };
    return t;
  },
}));

describe('Hero Section', () => {
  it('renders correctly with mocked translations', () => {
    render(<Hero />);

    expect(screen.getByText('Mocked Status')).toBeInTheDocument();
    expect(screen.getByText('Mocked Greeting')).toBeInTheDocument();
    expect(screen.getByText('Mocked Name')).toBeInTheDocument();
    expect(screen.getByText('Mocked Role')).toBeInTheDocument();
    expect(screen.getByText('Mocked Description')).toBeInTheDocument();
    expect(screen.getByText('Mocked CTA')).toBeInTheDocument();
    expect(screen.getByText('Download CV')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mocked CTA' })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/mocked-resume.pdf');
  });
});
