// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: just log the host header
  console.log('Incoming request host:', request.headers.get('host'));

  // Must return NextResponse
  return NextResponse.next();
}

// Optional: apply middleware only to the homepage
export const config = {
  matcher: ['/'],
};