import { NextRequest, NextResponse } from "next/server";
import { getSkillSuggestions } from "@/lib/services/training";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const suggestions = await getSkillSuggestions(user.id, query);
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
