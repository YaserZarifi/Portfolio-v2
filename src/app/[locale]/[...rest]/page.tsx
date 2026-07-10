import { notFound } from "next/navigation";

/** Any path not matched by a real route renders the localized 404. */
export default function CatchAllPage() {
  notFound();
}
