import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Globe, FileText, UserPlus } from 'lucide-react';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import ProfileImageUploader from '../components/ProfileImageUploader';

export function RegisterForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Registration successful! Please log in with your credentials.');
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      setErrors({ form: 'Registration failed. Please try again.' });
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
          Registration Screen
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

          {/* Row 2: Email Address | Phone Number */}
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
            <FormField
              id="reg-phone"
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 555-0199"
              error={errors.phone}
              required
              autoComplete="tel"
              icon={Phone}
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
              required
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
              required
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
            Register Users
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
