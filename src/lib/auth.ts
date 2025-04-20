import { supabase } from './supabase';

// Generate a unique anonymous ID for users who aren't logged in
export const getOrCreateUserId = (): string => {
  if (typeof window === 'undefined') {
    return 'server-side';
  }
  
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    // Generate a unique ID
    userId = `anon_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('userId', userId);
  }
  
  return userId;
};

// Check if user is authenticated with Supabase
export const isAuthenticated = async (): Promise<boolean> => {
  const { data, error } = await supabase.auth.getSession();
  return !error && data.session !== null;
};

// Get current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
