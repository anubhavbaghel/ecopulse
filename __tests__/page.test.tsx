import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signInWithPopup } from 'firebase/auth';
import LandingPage from '@/app/page';
import { useAuthStore } from '@/lib/stores/authStore';
import { UserProfile } from '@/types/user';

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

const profile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  uid: 'user-1',
  email: 'user@example.com',
  displayName: 'Eco User',
  dailyTargetKg: 8,
  baselineCo2Kg: 9.5,
  onboardingComplete: false,
  createdAt: '2026-06-21T00:00:00.000Z',
  updatedAt: '2026-06-21T00:00:00.000Z',
  ...overrides,
});

describe('LandingPage', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    jest.mocked(signInWithPopup).mockReset();
    useAuthStore.setState({ user: null, profile: null, loading: false });
  });

  it('renders the public landing page and starts Google sign in', async () => {
    jest.mocked(signInWithPopup).mockResolvedValue({} as never);

    render(<LandingPage />);

    expect(screen.getByRole('heading', { name: /small actions/i })).toBeInTheDocument();
    expect(screen.getByText(/personal climate companion/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    expect(signInWithPopup).toHaveBeenCalledTimes(1);
  });

  it('shows a friendly message when the sign-in popup is cancelled', async () => {
    jest.mocked(signInWithPopup).mockRejectedValue(new Error('popup closed by user'));

    render(<LandingPage />);

    await userEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    expect(await screen.findByText('Sign-in cancelled.')).toBeInTheDocument();
  });

  it('routes authenticated users who still need onboarding', async () => {
    useAuthStore.setState({
      user: { uid: 'user-1' } as never,
      profile: profile({ onboardingComplete: false }),
      loading: false,
    });

    render(<LandingPage />);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/onboarding'));
  });

  it('routes authenticated users with completed onboarding to the dashboard', async () => {
    useAuthStore.setState({
      user: { uid: 'user-1' } as never,
      profile: profile({ onboardingComplete: true }),
      loading: false,
    });

    render(<LandingPage />);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/dashboard'));
  });
});
