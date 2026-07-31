import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ignora arquivos estáticos e de sistema
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname.match(/\.(jpg|png|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Permite acesso direto à página de login e à API de autenticação
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Verifica o cookie de sessão do admin
  const sessionCookie = request.cookies.get('mu_admin_session');

  if (!sessionCookie || sessionCookie.value !== 'authenticated') {
    // Redireciona para o login se não tiver permissão
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
