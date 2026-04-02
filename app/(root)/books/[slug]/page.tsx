import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { sampleBooks } from "@/lib/constants";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BookDetailPage({ params }: PageProps) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const { title, author, coverURL, persona } = result.data;
  const coverSrc = coverURL || sampleBooks[0].coverURL;
  const voiceLabel = persona || "Default";

  return (
    <div className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to library">
        <ArrowLeft className="h-5 w-5 text-[#212a3b]" />
      </Link>

      <div className="vapi-main-container gap-6">
        <section className="vapi-header-card w-full">
          <div className="vapi-cover-wrapper shrink-0">
            <Image
              src={coverSrc}
              alt={title}
              width={120}
              height={180}
              className="relative h-[180px] w-[120px] rounded-lg object-cover shadow-[0px_10px_30px_0px_rgba(0,0,0,0.1)]"
            />
            <div className="vapi-mic-wrapper">
              <button
                type="button"
                className="vapi-mic-btn h-[60px] w-[60px] min-h-[60px] min-w-[60px]"
                aria-label="Microphone off"
              >
                <MicOff className="h-7 w-7 text-[#212a3b]" strokeWidth={1.75} />
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

        <section className="transcript-container min-h-[400px] w-full">
          <div className="transcript-empty">
            <Mic
              className="mb-4 h-12 w-12 text-(--text-muted)"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="transcript-empty-text">No conversation yet</p>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
