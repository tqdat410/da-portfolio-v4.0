import { render, screen } from '@testing-library/react';
import { SkillsGrid } from './SkillsGrid';
import '@testing-library/jest-dom';

// Mock the next-intl useTranslations hook for the SkillsGrid component
jest.mock('next-intl', () => ({
  useTranslations: (namespace) => {
    const commonTranslations = {
      'About.skills.categories': {
        frontend: { title: 'Frontend Skills', items: ['React', 'Next.js', 'TypeScript'] },
        backend: { title: 'Backend Skills', items: ['Node.js', 'Express', 'MongoDB'] },
        tools: { title: 'Tools & Others', items: ['Git', 'Docker', 'AWS'] },
      },
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

describe('SkillsGrid', () => {
  it('renders all skill categories and their items', () => {
    render(<SkillsGrid />);

    // Check Frontend Skills
    expect(screen.getByText('Frontend Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Check Backend Skills
    expect(screen.getByText('Backend Skills')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Express')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();

    // Check Tools & Others
    expect(screen.getByText('Tools & Others')).toBeInTheDocument();
    expect(screen.getByText('Git')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('renders the data-testid attribute', () => {
    render(<SkillsGrid />);
    expect(screen.getByTestId('skills-grid')).toBeInTheDocument();
  });
});