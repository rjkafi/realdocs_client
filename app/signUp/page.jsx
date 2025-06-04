'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axiosPublic from '@/app/utils/axiosPublic';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

const image_hosting_key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
  setServerError('');
  console.log('Submitting signup data:', data);

  try {
    const imageFile = new FormData();
    imageFile.append('image', data.avatar[0]);

    const imageRes = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const imageUrl = imageRes?.data?.data?.display_url;
    console.log('Image uploaded:', imageUrl);

    const res = await axiosPublic.post('/realdocs/users/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: imageUrl,
    });

    console.log('Backend response:', res.data);

    if (res.data.success) {
      reset();
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Signup error:', error);
    setServerError(error.response?.data?.message || 'Something went wrong');
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        {serverError && <p className="text-red-500 text-sm mb-2">{serverError}</p>}

        {/* Full Name */}
        <div className="mb-3">
          <input
            type="text"
            placeholder=" Full Name"
            {...register('name', { required: ' Name is required' })}
            className="w-full px-4 py-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-4 py-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Avatar Upload */}
        <div className="form-control my-2.5">
          <label className="label">
            <span className="label-text">Avatar*</span>
          </label>
          <input
           type="file"
            accept="image/*"
             {...register('avatar', { required: 'Avatar is required' })}
            className="file-input w-full "
          />
         {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              pattern: {
                value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                message:
                  'Password must include uppercase, lowercase, number, and special character',
              },
            })}
            className="w-full px-4 py-2 border rounded"
          />
          <button onClick={togglePassword} className="absolute right-3 top-2 text-xl text-gray-600">
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
