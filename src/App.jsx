// src/App.jsx (Final User App Version - No Admin Routes)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// User Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import JoinTournamentPage from './pages/JoinTournamentPage';
import ProfilePage from './pages/ProfilePage';
import MyContestsPage from './pages/MyContestsPage';
import LiveMatchPage from './pages/LiveMatchPage';
import ResultsPage from './pages/ResultsPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // <-- NEW
import TermsPage from './pages/TermsPage';
import EditProfilePage from './pages/EditProfilePage'; // <-- NEW
import BracketViewPage from './pages/BracketViewPage'; // <-- Naya Import


// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        {/* --- USER ROUTES --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
            <Route index element={<HomePage />} />
            <Route path="my-contests" element={<MyContestsPage />} />
            <Route path="join-tournament/:id" element={<JoinTournamentPage />} />
            <Route path="live-match/:id" element={<LiveMatchPage />} />
            <Route path="results/:id" element={<ResultsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="transactions" element={<TransactionHistoryPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} /> {/* <-- NEW */}
            <Route path="terms" element={<TermsPage />} /> {/* <-- NEW */}
            <Route path="edit-profile" element={<EditProfilePage />} /> {/* <-- NEW */}
          {/* ... baaki user routes */}
          <Route path="bracket/:id" element={<BracketViewPage />} /> {/* <-- Naya Route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;