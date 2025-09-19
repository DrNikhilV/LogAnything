import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget"; // <-- added
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header"; // <-- old header on auth pages
import './signup.css'; // Import the CSS file

const Signup = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
	});
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { theme } = useTheme();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
			setMessage(res.data.msg);
		} catch (error) {
			setMessage(error.response?.data?.msg || "Signup failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Header /> {/* old header on /signup */}
			<main className={`signup-page ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
				<section className="signup-hero">
					<div className="hero-left">
						{/* Decorative image from Unsplash */}
						<div className="hero-image-wrap">
							<img
								alt="Journaling"
								src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80"
							/>
							<div className="hero-overlay">
								<h3>Start capturing moments</h3>
								<p>Build a habit. Track progress. Reflect daily.</p>

								{/* simple SVG mini-chart as visual garnish */}
								<svg className="mini-chart" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden>
									<rect x="8" y="18" width="10" height="22" rx="2" fill="#60a5fa" />
									<rect x="28" y="10" width="10" height="30" rx="2" fill="#7c3aed" />
									<rect x="48" y="22" width="10" height="18" rx="2" fill="#34d399" />
									<rect x="68" y="6" width="10" height="34" rx="2" fill="#fb923c" />
									<rect x="88" y="14" width="10" height="26" rx="2" fill="#f97316" />
								</svg>
							</div>
						</div>

						{/* short features */}
						<ul className="hero-features">
							<li>Private & secure journaling</li>
							<li>Multi-category logs (fitness, food, movies…)</li>
							<li>Beautiful analytics & reminders</li>
						</ul>
					</div>

					<div className="hero-right">
						<div className="signup-card">
							<h2>Sign up to LogAnything</h2>

							<form onSubmit={handleSubmit} className="signup-form">
								<div className="input-row">
									<div className="input-col">
										<label htmlFor="firstname">First Name <span className="required">*</span></label>
										<input id="firstname" type="text" placeholder="First name" onChange={handleChange} name="firstName" value={formData.firstName} required />
									</div>
									<div className="input-col">
										<label htmlFor="lastname">Last Name</label>
										<input id="lastname" type="text" placeholder="Last name" onChange={handleChange} name="lastName" value={formData.lastName} />
									</div>
								</div>

								<label htmlFor="username">Username <span className="required">*</span></label>
								<input id="username" type="text" placeholder="Username" onChange={handleChange} name="username" value={formData.username} required />

								<label htmlFor="email">Email <span className="required">*</span></label>
								<input id="email" type="email" placeholder="Email address" onChange={handleChange} name="email" value={formData.email} required autoComplete="on" />

								<label htmlFor="password">Password <span className="required">*</span></label>
								<input id="password" type="password" placeholder="Password" onChange={handleChange} name="password" value={formData.password} required />

								<button type="submit" className="signup-button" disabled={isLoading}>
									{isLoading ? "Signing up..." : "Create account"}
									<svg className="btn-blob" width="48" height="12" viewBox="0 0 48 12" fill="none" aria-hidden>
										<ellipse cx="24" cy="6" rx="24" ry="6" fill="rgba(255,255,255,0.08)"/>
									</svg>
								</button>
							</form>

							<div className="signup-footer">
								<p>Already have an account? <Link to="/login">Log in</Link></p>
								{message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
							</div>
						</div>
					</div>
				</section>
			</main>

			<ChatWidget />
			<Footer />
		</>
	);
};

export default Signup;