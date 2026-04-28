import { NextRequest, NextResponse } from "next/server";
import { improveStory } from "@/lib/gemini";
import { StoryPage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const {
      story,
      feedback,
    }: {
      story: { title: string; subtitle: string; pages: StoryPage[] };
      feedback: string;
    } = await request.json();

    if (!story || !feedback) {
      return NextResponse.json(
        { error: "Story and feedback are required" },
        { status: 400 }
      );
    }

    const improved = await improveStory(story, feedback);

    return NextResponse.json({
      ...improved,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Story improvement error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to improve story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
