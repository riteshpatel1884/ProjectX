import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/api/webhook(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated but not on onboarding, check if profile is complete
  if (!isOnboardingRoute(req)) {
    try {
      // Check if user has completed profile
      const response = await fetch(new URL('/api/user/check-profile', req.url), {
        headers: {
          'x-user-id': userId,
        },
      });

      const { isComplete } = await response.json();

      // If profile incomplete, redirect to onboarding
      if (!isComplete) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};