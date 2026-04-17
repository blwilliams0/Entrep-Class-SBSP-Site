import { NextRequest, NextResponse } from "next/server";
import { buildVisitorHash, getIpAddress, getUserAgent } from "@/lib/fingerprint";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

interface ContactBody {
  name?: string;
  email?: string;
  company?: string;
  linkedResponseId?: number | null;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactBody;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const company = body.company?.trim() || null;

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);
    const visitorHash = buildVisitorHash(ipAddress, userAgent);

    const supabase = getSupabaseServerClient();

    let linkedResponseId = body.linkedResponseId ?? null;

    if (!linkedResponseId) {
      const { data: responseRow } = await supabase
        .from("responses")
        .select("id")
        .eq("visitor_hash", visitorHash)
        .maybeSingle();

      linkedResponseId = responseRow?.id ?? null;
    }

    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      company,
      linked_response_id: linkedResponseId
    });

    if (error) {
      return NextResponse.json({ error: "Unable to save contact." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
