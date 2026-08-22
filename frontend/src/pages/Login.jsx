import React, { useState } from 'react';
import { User, LogIn } from 'lucide-react';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';
import ProfileImageUploader from '../components/ProfileImageUploader';

export function LoginForm({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username or Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem('token', 'demo-token');
      alert('Login successful! Welcome to GlobeTrotter.');
    } catch (err) {
      setErrors({ form: 'Invalid username or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center h-full py-2 px-2 sm:px-4">
      {/* Top Section: Circular Photo / Avatar Visual */}
      <ProfileImageUploader
        imagePreview={profileImage}
        onImageChange={(_, previewUrl) => setProfileImage(previewUrl)}
        onImageRemove={() => setProfileImage(null)}
        label="Photo"
      />

      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 italic tracking-tight">
          Sign In
        </h2>
        <p className="text-xs text-slate-500 italic mt-1 font-normal">
          Enter your credentials to access your account
        </p>
      </div>

      {errors.form && (
        <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs italic text-center">
          {errors.form}
        </div>
      )}

      {/* Login Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-accent-50/40 rounded-2xl border border-accent-100/60 space-y-3.5">
          <FormField
            id="login-username"
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="Username or email"
            error={errors.username}
            required
            autoComplete="username"
            icon={User}
          />

          <PasswordField
            id="login-password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => alert('Password reset affordance: Please contact support or use registration email.')}
              className="text-xs font-medium text-accent-600 hover:text-accent-800 italic transition"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <div className="pt-1">
          <PrimaryButton type="submit" isLoading={isLoading} icon={LogIn}>
            Login Button
          </PrimaryButton>
        </div>
      </form>

      {/* Mobile-only CTA link */}
      {onSwitchToRegister && (
        <div className="mt-4 text-center md:hidden">
          <p className="text-xs text-slate-600 italic font-normal">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-medium text-accent-600 hover:text-accent-800 underline italic"
            >
              Register Users
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
