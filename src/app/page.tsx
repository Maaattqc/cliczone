import { SearchBar } from '@/components/search/search-bar'
import { ToolsGrid } from '@/components/home/tools-grid'
import { BlogPreview } from '@/components/home/blog-preview'
import { CTASection } from '@/components/home/cta-section'
import { HeroSection } from '@/components/home/hero-section'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Search Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Trouvez l'information en quelques secondes
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Verify a contractor, a flood zone, a contaminated site and more. Instant results from official registries.
          </p>
        </div>
        <SearchBar />
      </section>

      {/* Tools Grid */}
      <ToolsGrid />

      {/* Blog Preview */}
      <BlogPreview />

      {/* CTA Section */}
      <CTASection />
    </main>
  )
}
