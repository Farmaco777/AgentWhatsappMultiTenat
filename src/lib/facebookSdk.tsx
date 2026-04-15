'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function FacebookSDK() {
  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'TU_APP_ID_AQUI',
        cookie: true,
        xfbml: true,
        version: 'v21.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0] as any;
      if (d.getElementById(id)) return;
      js = d.createElement(s) as any; js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  return null;
}

export const launchWhatsAppSignup = (callback: (data: any) => void) => {
  if (!window.FB) {
    console.error('Facebook SDK no cargado');
    return;
  }

  window.FB.login((response: any) => {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;
      
      // En un flujo real de Embedded Signup, Meta devuelve el context
      // Aquí simulamos la captura de los IDs necesarios
      // Normalmente se usa window.addEventListener('message', ...) para capturar el setup final
      console.log('Login exitoso, token obtenido:', accessToken);
      
      callback({
        accessToken,
        // En una implementación real, estos IDs se extraen del mensaje de éxito del popup
        phoneNumberId: 'PENDING_FROM_POPUP',
        wabaId: 'PENDING_FROM_POPUP'
      });
    } else {
      console.log('El usuario canceló el inicio de sesión o no autorizó la aplicación.');
    }
  }, {
    scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
    extras: {
      feature: 'whatsapp_embedded_signup',
      // Aquí iría tu Configuration ID de Meta
      setup: { }
    }
  });
};
