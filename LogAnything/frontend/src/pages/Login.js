import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import Footer from "../components/Footer";
import Header from "../components/Header"; // <-- add old header
import { toast } from "react-toastify";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header /> {/* show old header on /login */}

      <main className={`login-page ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        <section className="login-hero">
          <div className="hero-left">
            <div className="hero-image-wrap">
              <img
                alt="Journaling"
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80"
              />
              <div className="hero-overlay">
                <h3>Welcome back</h3>
                <p>Sign in to continue capturing thoughts and tracking habits.</p>

                <svg className="mini-chart" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden>
                  <rect x="6" y="18" width="10" height="22" rx="2" fill="#60a5fa" />
                  <rect x="28" y="8" width="10" height="32" rx="2" fill="#7c3aed" />
                  <rect x="50" y="20" width="10" height="20" rx="2" fill="#34d399" />
                  <rect x="72" y="4" width="10" height="36" rx="2" fill="#fb923c" />
                  <rect x="94" y="14" width="10" height="26" rx="2" fill="#f97316" />
                </svg>
              </div>
            </div>

            <ul className="hero-features">
              <li>Fast sign in</li>
              <li>Secure sessions</li>
              <li>Pick up where you left off</li>
            </ul>
          </div>

          <div className="hero-right">
            <div className="login-card">
              <h2>Log in to LogAnything</h2>

              <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="on"
                />

                <label htmlFor="password">Password <span className="required">*</span></label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="login-button" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                  <svg className="btn-blob" width="48" height="12" viewBox="0 0 48 12" fill="none" aria-hidden>
                    <ellipse cx="24" cy="6" rx="24" ry="6" fill="rgba(255,255,255,0.08)"/>
                  </svg>
                </button>

                <div className="signup-link" style={{ marginTop: 8 }}>
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Login;
