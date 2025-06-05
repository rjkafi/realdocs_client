'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axiosPublic from '@/app/utils/axiosPublic';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { signIn } from 'next-auth/react';

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
      console.log({
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: imageUrl,
      });

      if (res.data.success) {
        reset();

        // Automatically sign the user in after registration
        const signInRes = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
          callbackUrl: '/dashboard',
        });

        if (signInRes?.ok) {
          router.push('/dashboard');
        } else {
          setServerError('Sign in failed after registration');
        }
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
        <div className="mt-6 mb-3">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className=" hover:bg-blue-700 transition text-gray-600 border font-semibold py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272v95.1h146.6c-6.3 34-25.2 62.8-53.9 82.1v68.2h87.2c51-47 80.6-116.2 80.6-195.1z"
                fill="#4285F4"
              />
              <path
                d="M272 544.3c72.6 0 133.6-24 178.1-64.9l-87.2-68.2c-24.2 16.2-55 25.8-90.9 25.8-69.9 0-129.2-47.2-150.3-110.6H32.5v69.7c44.3 87.8 134.2 148.2 239.5 148.2z"
                fill="#34A853"
              />
              <path
                d="M121.7 326.4c-10.3-30.6-10.3-63.6 0-94.2v-69.7H32.5c-36.6 72.4-36.6 158.9 0 231.3l89.2-67.4z"
                fill="#FBBC04"
              />
              <path
                d="M272 107.7c39.4 0 75 13.6 102.9 40.4l77.3-77.3C405.6 24.5 344.6 0 272 0 166.7 0 76.8 60.4 32.5 148.2l89.2 69.7C142.8 154.9 202.1 107.7 272 107.7z"
                fill="#EA4335"
              />
            </svg>
            Continue in with Google
          </button>
        </div>
        <p className="text-lg text-gray-400 px-5 text-center flex items-center justify-center">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="px-4">or</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </p>

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
