import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm font-semibold">TaskChain</p>
            <p className="text-xs text-muted-foreground">
              Gamifying developer productivity
            </p>
          </div>

          <nav className="flex justify-center gap-4">
            <Link href="/about" className="text-xs text-muted-foreground">
              About
            </Link>
            <Link href="/docs" className="text-xs text-muted-foreground">
              Docs
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground">
              Terms
            </Link>
          </nav>

          <div className="flex justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="px-4 py-3">
          <p className="text-xs text-center text-muted-foreground">
            © {currentYear} TaskChain
          </p>
        </div>
      </div>
    </footer>
  );
}
