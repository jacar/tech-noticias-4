import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      // Add custom headers for API requests
      const headers = new Headers(request.headers);
      headers.set('x-api-client', 'webcincodev-news-app');
      
      // Return the request with the modified headers
      return NextResponse.next({
        request: {
          headers,
        },
      });
    } catch (error) {
      console.error('API middleware error:', error);
      
      // Determine the appropriate error code
      const statusCode = error instanceof Error && 'statusCode' in error 
        ? (error as any).statusCode 
        : 500;
      
      // Redirect to the appropriate error page
      return NextResponse.redirect(
        new URL(`/error`, request.url)
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
