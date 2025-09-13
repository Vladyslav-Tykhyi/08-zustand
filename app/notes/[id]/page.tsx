import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Попереднє завантаження даних
  const note = await queryClient.fetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient note={note} />
    </HydrationBoundary>
  );
}
