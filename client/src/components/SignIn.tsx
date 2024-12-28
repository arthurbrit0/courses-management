"use client";

import { SignIn, useUser } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes';
import { useSearchParams } from 'next/navigation';

const SignInComponent = () => {

  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  const signUpUrl = isCheckoutPage ? `/checkout?step=1&id=${courseId}&showSignUp=true` : "/signup";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
        return `/checkout?step=2&id=${courseId}&showSignUp=false`;
    }

    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
        return "/teacher/courses";
    }
    
    return "/user/courses";

  }

  return (
    <SignIn
        appearance={{
            baseTheme: dark,
            elements: {
                rootBox: "flex justify-center items-center py-5",
                cardBox: "shadow-none",
                card: "bg-customgreys-secondarybg w-full shadow-none",
                footer: {
                    background: "#25262F",
                    padding: "0rem 2.5rem",
                    "& > div > div:nth-child(1)": {
                        background: "#25262F",
                    }
                },
                formFieldLabel: "text-white-50 font-normal"
            }
        }} 
        signUpUrl={signUpUrl}
        forceRedirectUrl={getRedirectUrl()}
        routing="hash"
        afterSignOutUrl="/"
    />
  )
}

export default SignInComponent