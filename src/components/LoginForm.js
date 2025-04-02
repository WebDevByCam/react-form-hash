import React from "react";
import { FaGoogle, FaGithub, FaLinkedin, FaShieldAlt } from "react-icons/fa";
import PasswordInput from "./PasswordInput";

function LoginForm({
    formData,
    handleChange,
    errors,
    showPassword,
    togglePasswordVisibility,
}) {
    return (
        <>
            <div className="form-group">
                <label htmlFor="loginId">
                    Login ID <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="loginId"
                        name="loginId"
                        value={formData.loginId}
                        onChange={handleChange}
                        placeholder="Angelo"
                        required
                        aria-describedby="loginId-error"
                    />
                </div>
                {errors.loginId && (
                    <span className="error" id="loginId-error">
                        {errors.loginId}
                    </span>
                )}
            </div>
            <PasswordInput
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
            />
            <div className="social-login">
                <button
                    type="button"
                    className="social-btn google"
                    aria-label="Sign in with Google"
                >
                    <FaGoogle />
                </button>
                <button
                    type="button"
                    className="social-btn github"
                    aria-label="Sign in with GitHub"
                >
                    <FaGithub />
                </button>
                <button
                    type="button"
                    className="social-btn linkedin"
                    aria-label="Sign in with LinkedIn"
                >
                    <FaLinkedin />
                </button>
                <button
                    type="button"
                    className="social-btn authy"
                    aria-label="Sign in with Authy"
                >
                    <FaShieldAlt />
                </button>
            </div>
            <div className="divider">
                <span>OR</span>
            </div>
            <button type="button" className="connect-btn">
                UP STRATEGY CONNECT
            </button>
        </>
    );
}

export default LoginForm;
