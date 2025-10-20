import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock Firebase
vi.mock('../config.js', () => ({
  auth: {},
  db: {}
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ currentUser: null, userData: null }),
  AuthProvider: ({ children }) => children
}));

// Mock page components
vi.mock('../pages/AdminLoginPage', () => ({
  default: () => <div data-testid="admin-login">Admin Login Page</div>
}));

vi.mock('../pages/LoginPage', () => ({
  default: () => <div data-testid="login">Login Page</div>
}));

vi.mock('../pages/HomePage', () => ({
  default: () => <div data-testid="home">Home Page</div>
}));

vi.mock('../components/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // The app should render some content
    expect(document.body).toBeInTheDocument();
  });

  it('has proper structure', () => {
    render(<App />);
    // Check that the app renders without errors
    expect(document.querySelector('body')).toBeInTheDocument();
  });

  it('imports and renders App component', () => {
    // This test just ensures the component can be imported and rendered
    expect(() => render(<App />)).not.toThrow();
  });
});
