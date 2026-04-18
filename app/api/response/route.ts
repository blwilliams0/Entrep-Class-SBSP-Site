import { NextRequest, NextResponse } from "next/server";
import { buildVisitorHash, getIpAddress, getUserAgent } from "@/lib/fingerprint";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Vote = "Yes" | "Maybe" | "No";

const ALLOWED_VOTES: Vote[] = ["Yes", "Maybe", "No"];

interface ExistingResponseRow {
  id: number;
  response: Vote;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { response?: Vote };

    if (!body?.response || !ALLOWED_VOTES.includes(body.response)) {
      return NextResponse.json({ error: "Invalid response option." }, { status: 400 });
    }

    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);
    const visitorHash = buildVisitorHash(ipAddress, userAgent);
    const supabase = getSupabaseServerClient();

    const { data: existing } = await supabase
      .from("responses")
      .select("id,response")
      .eq("visitor_hash", visitorHash)
      .maybeSingle();

    const existingResponse = (existing as ExistingResponseRow | null) ?? null;

    if (existingResponse) {
      return NextResponse.json(
        { error: "Response already recorded.", responseId: existingResponse.id, response: existingResponse.response },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("responses")
      .insert({
        response: body.response,
        ip_address: ipAddress,
        user_agent: userAgent,
        visitor_hash: visitorHash
      })
      .select("id,response")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Response already recorded." }, { status: 409 });
      }

      return NextResponse.json({ error: "Unable to save response." }, { status: 500 });
    }

    return NextResponse.json({ success: true, responseId: data.id, response: data.response }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
