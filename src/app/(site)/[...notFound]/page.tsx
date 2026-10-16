import { notFound } from "next/navigation"

/** Catch-all: unknown paths render the (site) not-found page inside the site layout (header, footer, GTM). */
export default function CatchAll() {
  notFound()
}
