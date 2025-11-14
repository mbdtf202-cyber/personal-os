import { NextRequest, NextResponse } from "next/server";
import { createSession, getUserSessions } from "@/lib/services/training";
import { createSessionSchema, sessionFiltersSchema } from "@/lib/validations/training";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    const session = await createSession(user.id, validatedData);
    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters: any = {};

    if (searchParams.get("startDate")) filters.startDate = searchParams.get("startDate");
    if (searchParams.get("endDate")) filters.endDate = searchParams.get("endDate");
    if (searchParams.get("projectId")) filters.projectId = searchParams.get("projectId");
    if (searchParams.get("planId")) filters.planId = searchParams.get("planId");
    if (searchParams.get("aiInvolved")) filters.aiInvolved = searchParams.get("aiInvolved") === "true";
    if (searchParams.get("domains")) filters.domains = searchParams.get("domains")?.split(",");
    if (searchParams.get("types")) filters.types = searchParams.get("types")?.split(",");

    const validatedFilters = Object.keys(filters).length > 0 ? sessionFiltersSchema.parse(filters) : undefined;
    const sessions = await getUserSessions(user.id, validatedFilters);
    return NextResponse.json(sessions);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid filters", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
