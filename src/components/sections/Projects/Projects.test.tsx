import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Projects } from './Projects';
import '@testing-library/jest-dom';

// Mock the next-intl useTranslations hook for the Projects section
jest.mock('next-intl', () => ({
  useTranslations: (namespace) => {
    const commonTranslations = {
      'Projects.title': 'My Projects',
      'Projects.description': 'A showcase of my work.',
      'Projects.items': [
        {
          title: 'Project Alpha',
          description: 'Short description for Project Alpha.', // For ProjectCard
          longDescription: 'This is the detailed long description for Project Alpha.', // For ProjectModal
          image: '/images/project-alpha.jpg',
          techStack: ['React', 'Next.js'], // For ProjectCard
          fullTechStack: ['React', 'Next.js', 'TailwindCSS', 'Jest'], // For ProjectModal
          github: 'https://github.com/project-alpha',
          url: 'https://project-alpha.com', // Corresponds to url in ProjectModal
          role: 'Developer',
          type: 'Web Application',
          duration: '3 months',
          status: 'Completed',
          learning: 'Learned a lot about web development.',
        },
        {
          title: 'Project Beta',
          description: 'Short description for Project Beta.', // For ProjectCard
          longDescription: 'This is the detailed long description for Project Beta.', // For ProjectModal
          image: '/images/project-beta.jpg',
          techStack: ['Vue', 'Nuxt.js'],
          fullTechStack: ['Vue', 'Nuxt.js', 'TypeScript', 'Cypress'],
          github: 'https://github.com/project-beta',
          url: 'https://project-beta.com',
          role: 'Frontend Developer',
          type: 'Mobile App',
          duration: '6 weeks',
          status: 'In Progress',
          learning: 'Improved my mobile development skills.',
        },
      ],
      'Projects.modal.viewProject': 'View Project',
      'Projects.modal.viewCode': 'View Code',
      'Projects.modal.close': 'Close',

      // ProjectModal specific translations
      'ProjectPopup.type': 'Type',
      'ProjectPopup.duration': 'Duration',
      'ProjectPopup.status': 'Status',
      'ProjectPopup.overview': 'Overview',
      'ProjectPopup.role': 'Role',
      'ProjectPopup.learning': 'Learning',
      'ProjectPopup.technologies': 'Technologies',
      'ProjectPopup.viewLive': 'View Live',
      'ProjectPopup.viewSource': 'View Source',
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

// Mock the Image component from next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    const { fill, ...rest } = props; // Destructure to remove fill prop
    return <img {...rest} />;
  },
}));

describe('Projects Section', () => {
  it('renders the Projects section title and description', () => {
    render(<Projects />);
    expect(screen.getByText('My Projects')).toBeInTheDocument();
  });

  it('renders all project items', () => {
    render(<Projects />);
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('opens project modal on click and displays project details', async () => {
    render(<Projects />);

    // Click on Project Alpha
    fireEvent.click(screen.getByText('Project Alpha'));

    // Wait for the modal to appear and display its content
    await waitFor(() => {
      expect(screen.getByText('This is the detailed long description for Project Alpha.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View Live' })).toHaveAttribute('href', 'https://project-alpha.com');
      expect(screen.getByRole('link', { name: 'View Source' })).toHaveAttribute('href', 'https://github.com/project-alpha');
    });
  });

  it('closes project modal when close button is clicked', async () => {
    render(<Projects />);

    expect(screen.queryByText('This is the detailed long description for Project Alpha.')).not.toBeInTheDocument();

    // Open the modal
    fireEvent.click(screen.getByText('Project Alpha'));

    // Wait for the modal to be open
    await waitFor(() => {
      expect(screen.getByText('This is the detailed long description for Project Alpha.')).toBeInTheDocument();
    });

    // Click the close button
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Wait for the modal to be closed
    await waitFor(() => {
      expect(screen.queryByText('This is the detailed long description for Project Alpha.')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });
  });
});
