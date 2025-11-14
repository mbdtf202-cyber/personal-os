import { NextRequest, NextResponse } from "next/server";
import { createSnippet, getSnippetsByDomain } from "@/lib/services/training-knowledge";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { domain } = await params;
    const body = await request.json();
    const snippet = await createSnippet(user.id, { ...body, domain });
    return NextResponse.json(snippet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { domain } = await params;
    const snippets = await getSnippetsByDomain(user.id, domain);
    return NextResponse.json(snippets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
