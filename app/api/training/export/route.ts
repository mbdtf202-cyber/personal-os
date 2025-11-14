import { NextRequest, NextResponse } from "next/server";
import { getUserSessions } from "@/lib/services/training";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const domains = searchParams.get("domains")?.split(",");

    const filters: any = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (domains) filters.domains = domains;

    const sessions = await getUserSessions(user.id, filters);

    if (format === "csv") {
      const csv = [
        ["Date", "Title", "Type", "Duration (min)", "Domains", "Skills", "AI Involved", "AI Tools", "Outcome Score"].join(","),
        ...sessions.map((s) =>
          [
            new Date(s.date).toISOString(),
            `"${s.title}"`,
            s.type,
            s.durationMin || "",
            `"${s.domains.join(", ")}"`,
            `"${s.skillTags.join(", ")}"`,
            s.aiInvolved,
            `"${s.aiTools.join(", ")}"`,
            s.outcomeScore || "",
          ].join(",")
        ),
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="training-sessions-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON format
    return NextResponse.json(sessions, {
      headers: {
        "Content-Disposition": `attachment; filename="training-sessions-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
