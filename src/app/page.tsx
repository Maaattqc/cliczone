import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Building2, Users, Briefcase, FileText } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find what you need in Quebec's public data
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Verify a contractor, a flood zone, contaminated land and more. Instant results from official registries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
                Start a search
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore by category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/immobilier" className="group">
              <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
                <Building2 className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  Real Estate
                </h3>
                <p className="text-sm text-muted-foreground">
                  Flood zones, contaminated sites, assessments
                </p>
              </div>
            </Link>
            
            <Link href="/entrepreneurs" className="group">
              <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
                <Briefcase className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  Contractors
                </h3>
                <p className="text-sm text-muted-foreground">
                  RBQ, business registries, complaints
                </p>
              </div>
            </Link>
            
            <Link href="/familles" className="group">
              <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
                <Users className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  Families
                </h3>
                <p className="text-sm text-muted-foreground">
                  Schools, daycares, health services
                </p>
              </div>
            </Link>
            
            <Link href="/emploi" className="group">
              <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
                <FileText className="h-8 w-8 mb-4 text-primary" />
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  Employment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Job offers, training, companies
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
