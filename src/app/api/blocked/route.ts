import { NextRequest, NextResponse } from "next/server";

function handler(_req: NextRequest) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}

export { handler as GET, handler as POST };
