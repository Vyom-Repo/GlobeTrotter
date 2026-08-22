import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Globe, FileText, UserPlus } from 'lucide-react';
import FormField from '../components/FormField';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';
import ProfileImageUploader from '../components/ProfileImageUploader';
import authService from '../services/authService';

export function RegisterForm({ onSwitchToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: '',
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const payload = {
        name: fullName,
        email: formData.email.trim(),
        password: formData.password,
        profile_photo_url: profileImagePreview || null,
      };

      const response = await authService.register(payload);
      alert('Registration successful! Welcome to GlobeTrotter.');
      if (onRegisterSuccess) {
        onRegisterSuccess(response.user);
      } else if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-center h-full py-1 px-2 sm:px-4">
      {/* Top Section: Photo / Avatar Uploader */}
      <ProfileImageUploader
        imagePreview={profileImagePreview}
        onImageChange={(file, previewUrl) => {
          setProfileImageFile(file);
          setProfileImagePreview(previewUrl);
        }}
        onImageRemove={() => {
          setProfileImageFile(null);
          setProfileImagePreview(null);
        }}
        label="Photo"
      />

      <div className="text-center mb-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 italic tracking-tight">
          Create Account
        </h2>
        <p className="text-xs text-slate-500 italic mt-0.5 font-normal">
          Fill in your details to join GlobeTrotter
        </p>
      </div>

      {errors.form && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs italic text-center">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Sub-container enclosing form fields */}
        <div className="p-3 bg-accent-50/40 rounded-2xl border border-accent-100/70 space-y-2">
          {/* Row 1: First Name | Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField
              id="reg-first-name"
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Jane"
              error={errors.firstName}
              required
              autoComplete="given-name"
              icon={User}
            />
            <FormField
              id="reg-last-name"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Doe"
              error={errors.lastName}
              required
              autoComplete="family-name"
              icon={User}
            />
          </div>

          {/* Row 2: Email Address | Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField
              id="reg-email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="jane@example.com"
              error={errors.email}
              required
              autoComplete="email"
              icon={Mail}
            />
            <PasswordField
              id="reg-password"
              label="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Row 3: City | Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField
              id="reg-city"
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Paris"
              error={errors.city}
              autoComplete="address-level2"
              icon={MapPin}
            />
            <FormField
              id="reg-country"
              label="Country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="France"
              error={errors.country}
              autoComplete="country-name"
              icon={Globe}
            />
          </div>

          {/* Additional Information */}
          <FormField
            id="reg-additional"
            label="Additional Information"
            value={formData.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            placeholder="Travel preferences, languages...."
            isTextArea
            rows={2}
            icon={FileText}
          />
        </div>

        {/* Register Users Button */}
        <div className="flex justify-center pt-1">
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            icon={UserPlus}
            className="sm:max-w-xs"
          >
            Create Account
          </PrimaryButton>
        </div>
      </form>

      {/* Mobile-only CTA link */}
      {onSwitchToLogin && (
        <div className="mt-3 text-center md:hidden">
          <p className="text-xs text-slate-600 italic font-normal">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-accent-600 hover:text-accent-800 underline italic"
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
