import Link from 'next/link';
import { BookOpen, Mail, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">EduPlatform</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering learners worldwide with high-quality online courses from industry experts.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-semibold mb-4">Courses</h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Web Development
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Mobile Development
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Design
              </Link>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Backend Development
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/careers"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Careers
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-3">
              <Link
                href="/help"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/community"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Community
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EduPlatform. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for learners everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}