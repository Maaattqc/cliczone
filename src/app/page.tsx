import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Building2, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClicZone — Quebec Public Data',
  description: 'Verify contractors, flood zones, contaminated land and more. Instant results from official registries.',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background -z-10" />
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            Quebec Public Data
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Essential Information
            <br />
            at Your Fingertips
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Verify contractors, flood zones, contaminated land and more. Instant results from official registries.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Button size="lg" asChild>
              <Link href="#search">Start a Search</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real Estate</h3>
                <p className="text-muted-foreground mb-4">Flood zones, contaminated land, zoning</p>
                <Button variant="link" asChild className="p-0">
                  <Link href="/immobilier">Explore →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Briefcase className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contractors</h3>
                <p className="text-muted-foreground mb-4">RBQ licenses, complaints, sanctions</p>
                <Button variant="link" asChild className="p-0">
                  <Link href="/entrepreneurs">Explore →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Families</h3>
                <p className="text-muted-foreground mb-4">Daycares, schools, services</p>
                <Button variant="link" asChild className="p-0">
                  <Link href="/familles">Explore →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <MapPin className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Employment</h3>
                <p className="text-muted-foreground mb-4">Permits, certifications, companies</p>
                <Button variant="link" asChild className="p-0">
                  <Link href="/emploi">Explore →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Search className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Start Your Search</h2>
          <p className="text-muted-foreground mb-8">
            Enter an address, contractor name, or business number
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background"
            />
            <Button size="lg">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
