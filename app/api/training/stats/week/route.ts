import { NextRequest, NextResponse } from "next/server";
import { getCurrentWeekStats } from "@/lib/services/training";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getCurrentWeekStats(user.id);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
