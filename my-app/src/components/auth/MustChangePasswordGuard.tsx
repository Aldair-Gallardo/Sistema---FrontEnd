// src/components/auth/MustChangePasswordGuard.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const RUTAS_PERMITIDAS = ['/cambiar-password', '/cerrar-sesion', '/logout'];

// Evita que un usuario interno con contraseña temporal navegue (o llegue por URL directa)
// a cualquier otra pantalla del panel antes de cambiarla.
export function MustChangePasswordGuard() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user?.mustChangePassword && !RUTAS_PERMITIDAS.includes(pathname)) {
      router.replace('/cambiar-password');
    }
  }, [user, pathname, router]);

  return null;
}
