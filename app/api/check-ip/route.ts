import { NextRequest, NextResponse } from "next/server";
import { buildVisitorHash, getIpAddress, getUserAgent } from "@/lib/fingerprint";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ipAddress = getIpAddress(request);
    const userAgent = getUserAgent(request);
    const visitorHash = buildVisitorHash(ipAddress, userAgent);

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("responses")
      .select("id,response")
      .eq("visitor_hash", visitorHash)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Unable to check visitor status." }, { status: 500 });
    }

    return NextResponse.json({
      alreadyResponded: Boolean(data),
      responseId: data?.id ?? null,
      response: data?.response ?? null
    });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
