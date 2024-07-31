'use client';

import React from 'react';
import { createClient } from '@/supabase/supabaseClient';

type OAuthProvider = 'google' | 'kakao';

const handleSocialLogin = async (provider: OAuthProvider) => {
  const supabase = createClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_REDIRECT_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`;
    return `${url}/auth/callback`;
  };

  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: getURL()
      // redirectTo: `${window.location.origin}/auth/callback`
      // redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth/callback`
    }
  });

  // const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL;

  // if (!redirectUrl) {
  //   console.error('NEXT_PUBLIC_REDIRECT_URL is not defined');
  //   return;
  // }

  // const { error } = await supabase.auth.signInWithOAuth({
  //   provider: provider,
  //   options: {
  //     redirectTo: `${redirectUrl}/auth/callback`
  //   }
  // });

  if (error) {
    console.error(`Error logging in with ${provider}:`, error.message);
  }
};

function SocialLoginButtons() {
  const handleLogin =
    (provider: OAuthProvider) => async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      await handleSocialLogin(provider);
    };

  return (
    <form className="flex flex-col gap-5">
      <button
        onClick={handleLogin('kakao')}
        className="w-[400px] h-[56px] bg-[#D9D9D9] rounded-md font-semibold"
      >
        카카오 로그인/회원가입
      </button>
      <button
        onClick={handleLogin('google')}
        className="w-[400px] h-[56px] bg-[#D9D9D9] rounded-md font-semibold"
      >
        구글 로그인/회원가입
      </button>
    </form>
  );
}

export default SocialLoginButtons;
