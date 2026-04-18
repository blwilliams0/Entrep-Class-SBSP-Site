import { NextRequest, NextResponse } from "next/server";
import { buildVisitorHash, getIpAddress, getUserAgent } from "@/lib/fingerprint";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

interface ResponseLookupRow {
  id: number;
  response: "Yes" | "Maybe" | "No";
}

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

    const responseRow = (data as ResponseLookupRow | null) ?? null;

    if (error) {
      return NextResponse.json({ error: "Unable to check visitor status." }, { status: 500 });
    }

    return NextResponse.json({
      alreadyResponded: Boolean(responseRow),
      responseId: responseRow?.id ?? null,
      response: responseRow?.response ?? null
    });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
