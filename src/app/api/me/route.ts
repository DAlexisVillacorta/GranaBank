import { NextResponse } from "next/server";

import { requireSession } from "@/lib/session";
import { handleError } from "@/server/errors/handle";
import { meService } from "@/server/services/me.service";

export async function GET() {
  try {
    const session = await requireSession();
    const profile = await meService.getProfile(session.sub);
    return NextResponse.json(profile);
  } catch (error) {
    return handleError(error);
  }
}
