import Link from "next/link";
import { BookOpen, FileText, Code, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Learn to Code with
            <span className="text-accent block mt-2">Menteronics</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-10 leading-relaxed">
            Master programming through structured tutorials and expert insights. 
            From fundamentals to advanced concepts, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutorials"
              className="btn-primary text-center px-8 py-4 text-lg"
            >
              Browse Tutorials
            </Link>
            <Link
              href="/blog"
              className="btn-secondary text-center px-8 py-4 text-lg"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Structured Learning</h3>
              <p className="text-gray-700 leading-relaxed">
                Follow well-organized tutorials with chapters and subtopics 
                that build on each other progressively.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Hands-On Code</h3>
              <p className="text-gray-700 leading-relaxed">
                Learn by doing with real code examples, complete with 
                syntax highlighting and detailed explanations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Content</h3>
              <p className="text-gray-700 leading-relaxed">
                Get insights from experienced developers through tutorials 
                and blog posts covering best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Explore our collection of tutorials across multiple programming languages and technologies.
          </p>
          <Link
            href="/tutorials"
            className="btn-primary inline-block px-8 py-4 text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Menteronics. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/tutorials" className="text-gray-600 hover:text-accent text-sm">
                <FileText className="w-5 h-5 inline mr-1" />
                Tutorials
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-accent text-sm">
                <BookOpen className="w-5 h-5 inline mr-1" />
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
