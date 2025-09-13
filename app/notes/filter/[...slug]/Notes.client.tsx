"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import styles from "./page.module.css";

interface NotesClientProps {
  initialPage: number;
  initialSearchQuery: string;
  tagFilter?: string;
}

export default function NotesClient({
  initialPage,
  initialSearchQuery,
  tagFilter,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["notes", page, debouncedSearchQuery, tagFilter],
    queryFn: () => fetchNotes(page, 12, debouncedSearchQuery, tagFilter),
    retry: 2,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.notes) {
      console.log("Data received:", data);
      if (data.notes.length === 0) {
        console.log("No notes found in response");
      }
    }
    if (isError) {
      console.error("Error fetching notes:", error);
    }
  }, [isSuccess, isError, data, error]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleOpenModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>
        Error loading notes
        {error && <p>{(error as Error).message}</p>}
      </div>
    );
  }

  const hasNotes = isSuccess && data?.notes?.length > 0;

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <header className={styles.toolbar}>
        <SearchBox
          onSearch={(query) => {
            setSearchQuery(query);
          }}
          initialQuery={initialSearchQuery}
        />

        {hasNotes && data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={(selectedPage) => setPage(selectedPage)}
          />
        )}
        <button
          className={styles.button}
          onClick={handleOpenModal}
          data-testid="create-note-button"
        >
          Create note +
        </button>
      </header>

      <main>
        {hasNotes ? (
          <NoteList notes={data?.notes || []} />
        ) : (
          <div className={styles.empty}>No notes found</div>
        )}
      </main>

      {isModalOpen && (
        <Modal>
          <NoteForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
