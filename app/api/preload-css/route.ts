// app/api/preload-css/route.ts
import { NextResponse } from 'next/server';  

export async function GET(request: Request) {  
  const host = request.headers.get('host');  
  const ORIGIN = `https://${host}`;  

  const response = await fetch(request.url);  
  const html = await response.text();  

  const cssMatch = html.match(/<link [^>]*href="([^"]+\.css)"[^>]*rel="stylesheet"[^>]*>/i);  

  let modifiedHtml = html;  
  if (cssMatch && cssMatch[1]) {  
    const cssUrl = cssMatch[1];  
    modifiedHtml = html.replace('<head>', `<head>\n    <link rel="preload" href="${cssUrl}" as="style">`);  
  }  

  return new Response(modifiedHtml, {  
    headers: { 'content-type': 'text/html' }  
  });  
}