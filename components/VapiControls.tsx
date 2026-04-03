"use client";
import Transcript from "@/components/Transcript";
import useVapi from "@/hooks/useVapi";
import { sampleBooks } from "@/lib/constants";
import { IBook } from "@/type";
import { Mic, MicOff } from "lucide-react";
import Image from "next/image";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearErrors,
  } = useVapi(book);

  const { title, author, coverURL, persona } = book;
  const coverSrc = coverURL || sampleBooks[0].coverURL;
  const voiceLabel = persona || "Default";
  const aiBusy = status === "thinking" || status === "speaking";
  const showAiPulse = isActive && aiBusy;
  return (
    <>
      <section className="vapi-header-card w-full">
        <div className="vapi-cover-wrapper shrink-0">
          <Image
            src={coverSrc}
            alt={title}
            width={120}
            height={180}
            className="relative h-[180px] w-[120px] rounded-lg object-cover shadow-[0px_10px_30px_0px_rgba(0,0,0,0.1)]"
          />
          <div className="vapi-mic-wrapper relative">
            {showAiPulse ? (
              <span
                className="vapi-pulse-ring pointer-events-none z-0"
                aria-hidden
              />
            ) : null}
            <button
              onClick={isActive ? stop : start}
              disabled={status === "connecting"}
              type="button"
              className={`vapi-mic-btn relative z-10 h-[60px] w-[60px] min-h-[60px] min-w-[60px] ${
                isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"
              }`}
              aria-label={
                isActive ? "Mute and end voice session" : "Start voice session"
              }
            >
              {isActive ? (
                <Mic className="h-7 w-7 text-[#212a3b]" strokeWidth={1.75} />
              ) : (
                <MicOff
                  className="h-7 w-7 text-[#212a3b]"
                  strokeWidth={1.75}
                />
              )}
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h1 className="font-serif text-2xl font-bold leading-tight text-[#212a3b] sm:text-3xl">
            {title}
          </h1>
          <p className="text-base font-medium text-[#3d485e]">by {author}</p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="vapi-status-indicator">
              <span className="vapi-status-dot vapi-status-dot-ready" />
              <span className="vapi-status-text">Ready</span>
            </div>
            <div className="vapi-status-indicator">
              <span className="vapi-status-text">Voice: {voiceLabel}</span>
            </div>
            <div className="vapi-status-indicator">
              <span className="vapi-status-text">0:00/15:00</span>
            </div>
          </div>
        </div>
      </section>
      <div className="vapi-transcript-wrapper w-full">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
    </>
  );
};

export default VapiControls;
