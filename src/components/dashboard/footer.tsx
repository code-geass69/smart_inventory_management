export function Footer(): JSX.Element {
  return (
    <footer className="mt-5 w-full border-t bg-tertiary/20 px-5 py-10 text-sm text-muted-foreground">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>
          © {new Date().getFullYear()} Zaiko Technologies. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a href="/app/footer/about" className="hover:underline">
            About
          </a>
          <a href="/app/footer/terms" className="hover:underline">
            Terms
          </a>
          <a href="/app/footer/privacy" className="hover:underline">
            Privacy
          </a>
          <a href="/app/footer/contact" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
