import { NextResponse, type NextRequest } from "next/server";

import { requireSession } from "@/lib/session";
import { MovementQuerySchema } from "@/schemas/movement.schema";
import { handleError } from "@/server/errors/handle";
import { movementService } from "@/server/services/movement.service";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const query = MovementQuerySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );
    const movements = await movementService.listByUser(session.sub, query);
    return NextResponse.json({ data: movements });
  } catch (error) {
    return handleError(error);
  }
}
