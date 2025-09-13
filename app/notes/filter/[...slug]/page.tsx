import { fetchNotes } from "@/lib/api";
import NotesClient from "../[...slug]/Notes.client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function NotesPage({
  params,
  searchParams,
}: NotesPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const page = parseInt(resolvedSearchParams.page || "1");
  const searchQuery = resolvedSearchParams.search || "";
  const tagFilter = resolvedParams.slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, searchQuery, tagFilter],
    queryFn: () => fetchNotes(page, 12, searchQuery, tagFilter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearchQuery={searchQuery}
        tagFilter={tagFilter}
      />
    </HydrationBoundary>
  );
}
