"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export const useCheckoutNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();

  const courseId = searchParams.get("id") ?? "";
  const checkoutStep = parseInt(searchParams.get("step") ?? "1", 10);

  const navigateToStep = useCallback(                                                   // Usamos o useCallback para evitar que a função seja recriada a cada renderização
    (step: number) => {                                                                 // A função navigateToStep recebe um argumento step
      const newStep = Math.min(Math.max(1,step), 3);                                    // A constante newStep é definida como o valor de step, limitado entre 1 e 3
      const showSignUp = isSignedIn ? "true" : "false";                                 // Se o usuário estiver lgoado, showSignUp é true

      router.push(`/checkout?id=${courseId}&step=${newStep}&showSignUp=${showSignUp}`)  // A função push do router é chamada com a URL de checkout, passando os parâmetros courseId, newStep e showSignUp
    },
    [courseId, isSignedIn, router]                                                      // courseId, isSignedIn e router são passados como dependências (a função só é recriada se as dependências mudarem)
  )

  useEffect(() => {
    if (isLoaded && !isSignedIn && checkoutStep > 1){                                   // Vamos verificar se o usuário está logado e está tentando acessar uma página de checkout sem ser a primeira
      navigateToStep(1)                                                                 // Caso esteja, o redirecionamos para o passo 1 do checkout
    }
  }, [isLoaded, isSignedIn, checkoutStep, navigateToStep]);                             // Vamos verificar toda vez que o isLoaded, isSignedIn, checkoutStep ou navigateToStep mudar

  return { checkoutStep, navigateToStep }                                               // Como fizemos um hook, retornamos o checkoutStep atual e a função navigateToStep

}

