"use client";

import { LifeEvent } from "@/types";

interface EventTimelineProps {
  events: LifeEvent[];
  onRemoveEvent: (id: string) => void;
}

export default function EventTimeline({
  events,
  onRemoveEvent,
}: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-5xl mb-4">&#128214;</div>
        <p className="text-lg">Your life events will appear here</p>
        <p className="text-sm mt-1">Add your first event to get started</p>
      </div>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-0 relative">
      <h3 className="text-xl font-bold mb-6" style={{ color: "#6366f1" }}>
        Your Timeline ({events.length} event{events.length !== 1 ? "s" : ""})
      </h3>
      <div className="relative pl-8">
        <div
          className="absolute left-3 top-0 bottom-0 w-0.5"
          style={{
            background: "linear-gradient(to bottom, #667eea, #764ba2)",
          }}
        />
        {sorted.map((event, index) => (
          <div
            key={event.id}
            className="relative mb-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="timeline-dot absolute -left-5 top-2" />
            <div className="bg-white rounded-xl p-4 card-shadow ml-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-medium text-indigo-500 mb-1">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h4 className="font-bold text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded-lg ml-3 flex-shrink-0"
                  />
                )}
              </div>
              <button
                onClick={() => onRemoveEvent(event.id)}
                className="text-xs text-red-400 hover:text-red-600 mt-2 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
