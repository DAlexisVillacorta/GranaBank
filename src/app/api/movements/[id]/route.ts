import { NextResponse } from "next/server";

import { requireSession } from "@/lib/session";
import { handleError } from "@/server/errors/handle";
import { movementService } from "@/server/services/movement.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const movement = await movementService.getByIdForUser(id, session.sub);
    return NextResponse.json({ data: movement });
  } catch (error) {
    return handleError(error);
  }
}
