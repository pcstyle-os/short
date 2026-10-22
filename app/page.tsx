import { Desk } from "@/components/Desk";
import { LinkShortener } from "@/components/LinkShortener";

export default function Home() {
  return (
    <Desk title="s" meta="~/pcstyle/s">
      <p className="lede" data-dither-text>long link in. short link out.</p>
      <dl className="facts">
        <dt>does</dt><dd>turns unwieldy urls into clean s.pcstyle.dev links</dd>
        <dt>with</dt><dd>optional custom aliases and click counts</dd>
        <dt>also</dt><dd>every file on <a href="https://upload.pcstyle.dev">upload.pcstyle.dev</a> gets one</dd>
      </dl>

      <h2 className="sect">shorten a link</h2>
      <LinkShortener />
      <p className="foot"><span>© 2026 Adam Krupa</span> <a href="https://pcstyle.dev">pcstyle.dev</a> <a href="https://github.com/pcstyle-os/short">github</a></p>
    </Desk>
  );
}
