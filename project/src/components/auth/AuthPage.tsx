import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Apple, Chrome, Loader2, X, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError(t('required_field'));
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t('invalid_email'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError(t('required_field'));
      return false;
    }
    if (password.length < 6) {
      setPasswordError(t('password_min_length'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setPasswordError(t('passwords_not_match'));
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = isSignUp 
        ? await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: window.location.origin
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(t('invalid_credentials'));
        } else if (error.message.includes('network')) {
          toast.error(t('network_error'));
        } else {
          toast.error(t('unknown_error'));
        }
        return;
      }

      if (data.user) {
        toast.success(isSignUp ? t('account_created') : t('login_success'));
        onAuthSuccess();
      }
    } catch (error: any) {
      toast.error(t('unknown_error'));
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderAuth = async (provider: 'google' | 'apple') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(t('unknown_error'));
      console.error('Provider auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">TaskFlow</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('organize_efficiently')}</p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    emailError ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                  bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 ${
                    emailError ? 'focus:ring-red-500 dark:focus:ring-red-400' : 'focus:ring-blue-500 dark:focus:ring-blue-400'
                  } focus:border-transparent sm:text-sm`}
                  placeholder={t('enter_email')}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    passwordError ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'
                  } rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                  bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 ${
                    passwordError ? 'focus:ring-red-500 dark:focus:ring-red-400' : 'focus:ring-blue-500 dark:focus:ring-blue-400'
                  } focus:border-transparent sm:text-sm`}
                  placeholder={t('enter_password')}
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                )}
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('confirm_password')}
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 
                    rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                    bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                    focus:border-transparent sm:text-sm"
                    placeholder={t('confirm_password')}
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl 
                shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 
                hover:bg-blue-700 dark:hover:bg-blue-600 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:focus:ring-offset-dark-800 dark:focus:ring-blue-400 
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isSignUp ? t('sign_up') : t('sign_in')
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">
                  {t('or_continue_with')}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleProviderAuth('google')}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-dark-600 
                rounded-xl shadow-sm bg-white dark:bg-dark-700 text-sm font-medium text-gray-500 dark:text-gray-400 
                hover:bg-gray-50 dark:hover:bg-dark-600 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:focus:ring-offset-dark-800 dark:focus:ring-blue-400 
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Chrome className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </button>

              <button
                onClick={() => handleProviderAuth('apple')}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-dark-600 
                rounded-xl shadow-sm bg-white dark:bg-dark-700 text-sm font-medium text-gray-500 dark:text-gray-400 
                hover:bg-gray-50 dark:hover:bg-dark-600 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:focus:ring-offset-dark-800 dark:focus:ring-blue-400 
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Apple className="h-5 w-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setPassword('');
                setConfirmPassword('');
                setEmailError('');
                setPasswordError('');
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              {isSignUp ? t('already_have_account') : t('no_account')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;