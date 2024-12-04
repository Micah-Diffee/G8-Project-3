import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Login.css';

// Google OAuth Client ID
const CLIENT_ID = '162752303669-bq71imvc2gtnunuveu68ddbenmql6j6l.apps.googleusercontent.com';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=30.601389&lon=-96.314445&appid=59676ae95b245e5d7341b81eb62ef3ac&units=imperial';

/**
 * Login page for employees. Handles user authentication via Google OAuth or manual login.
 */
function Login() {
    const [employees, setEmployees] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [email, setEmail] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeRole, setEmployeeRole] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        /**
         * Fetches employee data from the backend API.
         */
        fetch('https://panda-express-pos-backend-nc89.onrender.com/api/EmployeeInfo')
            .then(response => response.json())
            .then(data => setEmployees(data.employees))
            .catch(error => console.error('Error fetching data:', error));

        /**
         * Fetches weather data from the API. 
         */
        fetch(WEATHER_URL)
            .then(response => response.json())
            .then(data => setWeatherData(data))
            .catch(error => console.error('Error fetching data:', error));

        /**
         * Initializes Google OAuth by loading the script and setting up the login button.
         */
        const initializeGoogleOAuth = () => {
            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleGoogleLogin,
            });

            // Render the Google Login Button
            window.google.accounts.id.renderButton(
                document.getElementById('google-login-button'),
                {
                    theme: 'outline',
                    size: 'large',
                }
            );
        };

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = initializeGoogleOAuth;
        document.body.appendChild(script);

        return () => {
            // Cleanup script if the component unmounts
            document.body.removeChild(script);
        };
    }, []);

    /**
     * Handles Google login and decodes the user's credential token.
     * 
     * @function handleGoogleLogin
     * @param response - The response object from Google OAuth.
     */
    const handleGoogleLogin = (response) => {
        const decoded = jwtDecode(response.credential);
        if (decoded.email_verified) {
            setEmployeeName(decoded.given_name);
            setIsLoggedIn(true);
            setTimeout(function(){
                handleVerifiedGoogleLogin(decoded.email);
            }, 3500);
        } else {
            alert('Email not verified. Please use a verified account.');
        }
    };

    /**
     * Redirects a verified Google user to the appropriate page based on their role.
     * 
     * @function handleVerifiedGoogleLogin
     * @param email - The email of the logged-in user.
     */
    const handleVerifiedGoogleLogin = (email) => {
        if (email === 'cashier.pandaexpress@gmail.com') {
            navigate('/Cashier');
        } else if (email === 'manager.pandaexpress@gmail.com') {
            navigate('/Inventory');
        } else {
            let generatedEmail;
            const employeeMatch = employees.find((employee) => {
                if (employee.name.includes(' ')) {
                    const [firstName, lastName] = employee.name.split(' ');
                    generatedEmail = `${firstName.toLowerCase()}${lastName.toLowerCase()}.pandaexpress@gmail.com`;
                    setEmployeeName(firstName);
                }
                else {
                    generatedEmail = `${employee.name.toLowerCase()}.pandaexpress@gmail.com`;
                    setEmployeeName(employee.name);
                }
                setEmployeeRole(employee.employeerole);
                return generatedEmail === email;
            });

            if (employeeMatch) {
                const role = employeeMatch.employeerole;
                if (role == "Cashier") {
                    navigate('/Cashier');
                }
                else {
                    navigate('/Inventory');
                }
            } else {
                alert('You do not have permission to log in.');
            }
        }
    };

    /**
     * Handles manual login via email and password.
     * 
     * @function handleManualLogin
     * @param event - The submit event of the login form.
     */
    const handleManualLogin = (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        // Call API to authenticate email/password
        let generatedEmail;
        const user = employees.find((employee) => {
            if (employee.name.includes(' ')) {
                const [firstName, lastName] = employee.name.split(' ');
                generatedEmail = `${firstName.toLowerCase()}${lastName.toLowerCase()}.pandaexpress@gmail.com`;
                setEmployeeName(firstName);
            }
            else {
                generatedEmail = `${employee.name.toLowerCase()}.pandaexpress@gmail.com`;
                setEmployeeName(employee.name);
            }
            setEmployeeRole(employee.employeerole);
            return generatedEmail === email;
        });

        if (user && password && password == user.password) {
            setIsLoggedIn(true);
            setTimeout(function(){
                const role = user.employeerole;
                if (role == "Cashier") {
                    navigate('/Cashier');
                }
                else {
                    navigate('/Inventory');
                }
            }, 3500);
        } else {
            setError('Invalid email or password');
        }
    };

    /**
     * Navigates the user back to the home page.
     * 
     * @function handleBack
     */
    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className='page'>
            {isLoggedIn ? (
                <div className="welcome-container">
                    <h1>Welcome, {employeeName}!</h1>
                    {weatherData ? (
                        <div>
                            <p>
                                The current weather is {weatherData.main.temp}°F with {weatherData.weather[0].description}.
                            </p>
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt={weatherData.weather[0].description}
                            />
                        </div>
                    ) : (
                        <p>Loading weather data...</p>
                    )}
                </div>
            ) : (
            <body className="login-page">
                <div className="login-container">
                    <h1>Employee Login</h1>

                    {/* Manual Login Form */}
                    <form onSubmit={handleManualLogin} className="manual-login-form">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Login</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>

                    {/* Line with 'or' in the middle */}
                    <div className="or-divider">
                        <span>or</span>
                    </div>

                    {/* Google Login Button Container */}
                    <div id="google-login-button"></div>

                    <button className="back-button-login" onClick={handleBack}>Back</button>
                </div>
            </body>
            )}
        </div>
    );
}

export default Login;
