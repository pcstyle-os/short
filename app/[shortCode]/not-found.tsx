import Link from "next/link";
import { Desk } from "@/components/Desk";

export default function NotFound() {
  return (
    <Desk title="404" meta="link not found">
      <p className="lede" data-dither-text>link not found.</p>
      <p className="hint">this short link does not exist or has been removed.</p>
      <p className="foot"><Link href="/">create a new link</Link></p>
    </Desk>
  );
}
