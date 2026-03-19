import { NextRequest, NextResponse } from "next/server";
import { generateStoryFromEvents } from "@/lib/gemini";
import { LifeEvent } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { events }: { events: LifeEvent[] } = await request.json();

    if (!events || events.length === 0) {
      return NextResponse.json(
        { error: "No events provided" },
        { status: 400 }
      );
    }

    const story = await generateStoryFromEvents(events);

    return NextResponse.json({
      ...story,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Story generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
