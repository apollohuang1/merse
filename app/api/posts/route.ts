// posts.js
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  return NextResponse.json({ hello: 'world'});
}


export function POST(request: Request) {
  return NextResponse.json({ hello: 'world' });
}