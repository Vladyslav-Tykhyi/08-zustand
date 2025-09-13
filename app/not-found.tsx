import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "1rem",
        }}
      >
        404 - Page not found
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
          marginBottom: "2rem",
        }}
      >
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          color: "#0070f3",
          textDecoration: "none",
          fontWeight: "500",
          padding: "0.5rem 1rem",
          border: "2px solid #0070f3",
          borderRadius: "4px",
          transition: "all 0.2s",
        }}
      >
        Go back home
      </Link>
    </div>
  );
}
