import { NextRequest, NextResponse } from "next/server";
import { createResource, getResourcesByDomain } from "@/lib/services/training-knowledge";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const resource = await createResource(user.id, { ...body, domain: params.domain });
    return NextResponse.json(resource, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resources = await getResourcesByDomain(user.id, params.domain);
    return NextResponse.json(resources);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
