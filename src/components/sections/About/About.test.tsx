import { render, screen, fireEvent } from '@testing-library/react';
import { About } from './About';
import '@testing-library/jest-dom';

// Mock the next-intl useTranslations hook for the About section
jest.mock('next-intl', () => ({
  useTranslations: (namespace) => {
    const commonTranslations = {
      'About.title': 'About Me',
      'About.description': 'A short description about me.',
      'About.basicInfo.title': 'Information',
      'About.skills.title': 'Skills',
      'About.education.title': 'Education',
      'About.certificates.title': 'Certificates',
      'About.basicInfo.locationLabel': 'Location',
      'About.basicInfo.location': 'Mocked City, Country',
      'About.basicInfo.languagesLabel': 'Languages',
      'About.basicInfo.languages': 'English, Spanish',
      'About.basicInfo.statusLabel': 'Status',
      'About.basicInfo.status': 'Available',
      'About.education.items': [
        { school: 'Mocked University', degree: 'B.Sc. Computer Science', year: '2020', gpa: '3.8' }
      ],
      'About.certificates.items': [
        {
          name: 'Cert Group 1',
          count: 1,
          items: [
            { name: 'Cloud Practitioner', provider: 'AWS' }
          ]
        }
      ],
      'About.skills.categories': {
        frontend: { title: 'Frontend', items: ['React', 'Next.js'] },
        backend: { title: 'Backend', items: ['Node.js', 'Express'] },
      }
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

describe('About Section', () => {
  it('renders the About section title and description', () => {
    render(<About />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('A short description about me.')).toBeInTheDocument();
  });

  it('renders initial tab content (Information) correctly', () => {
    render(<About />);
    expect(screen.getByText('Information')).toBeInTheDocument(); // Tab label
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Mocked City, Country')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('English, Spanish')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('switches tab content when Skills tab is clicked', () => {
    render(<About />);
    fireEvent.click(screen.getByText('Skills'));
    // We only check for the existence of the SkillsGrid component,
    // as its content is handled by the component itself.
    expect(screen.getByTestId('skills-grid')).toBeInTheDocument(); // Assuming SkillsGrid has data-testid="skills-grid"
    expect(screen.queryByText('Mocked City, Country')).not.toBeInTheDocument(); // Content from previous tab
  });

  it('switches tab content when Education tab is clicked', () => {
    render(<About />);
    fireEvent.click(screen.getByText('Education'));
    expect(screen.getByText('Mocked University')).toBeInTheDocument();
    expect(screen.getByText('B.Sc. Computer Science')).toBeInTheDocument();
    expect(screen.queryByText('Mocked City, Country')).not.toBeInTheDocument(); // Content from previous tab
  });

  it('switches tab content when Certificates tab is clicked', () => {
    render(<About />);
    fireEvent.click(screen.getByText('Certificates'));
    expect(screen.getByText('Cloud Practitioner')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Mocked City, Country')).not.toBeInTheDocument(); // Content from previous tab
  });
});
