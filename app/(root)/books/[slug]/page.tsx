import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";

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
  const book = result.data;
  if (!result.success || !result.data) {
    redirect("/");
  }
  console.log("book deatils page", slug);

  return (
    <div className="book-page-container">
      <Link href="/" className="back-btn-floating" aria-label="Back to library">
        <ArrowLeft className="h-5 w-5 text-[#212a3b]" />
      </Link>

      <div className="vapi-main-container gap-6">
        {/* Transcript area */}
        <VapiControls book={book} />
      </div>
    </div>
  );
}
