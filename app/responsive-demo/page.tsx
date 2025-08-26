import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ResponsiveDemo() {
  return (
    <div className="w-full max-w-screen overflow-x-hidden min-h-screen bg-background">
      {/* Header Section */}
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 sm:py-8 lg:py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Halaman Responsif Demo
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Contoh implementasi responsive design dengan Tailwind CSS menggunakan breakpoint sm, md, dan lg
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="text-xs sm:text-sm">w-full</Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">max-w-screen</Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">overflow-x-hidden</Badge>
            </div>
          </div>
        </header>

        {/* Grid Layout Section */}
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-center">
            Grid Layout Responsif
          </h2>
          
          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Card key={item} className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg">Card {item}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    Konten responsif dengan text size yang berubah di setiap breakpoint
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Different Grid Layout: 1 col on mobile, 1 on tablet, 2 on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl">
                  Feature Utama
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base">
                  Deskripsi yang responsive dengan ukuran text berbeda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
                <Button className="w-full sm:w-auto text-xs sm:text-sm md:text-base">
                  Action Button
                </Button>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl">
                  Feature Sekunder
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base">
                  Konten dengan padding yang responsive
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="bg-muted rounded-lg p-3 sm:p-4 md:p-6">
                  <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-2">
                    Nested Content
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    Konten bersarang dengan spacing responsif
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <div className="text-center space-y-2 sm:space-y-4 lg:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
              Typography Responsif
            </h2>
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-muted-foreground">
              Subtitle dengan ukuran responsive
            </h3>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-4xl mx-auto leading-relaxed">
              Paragraf ini menggunakan text size yang berbeda di setiap breakpoint. 
              Pada mobile menggunakan text-xs, tablet text-sm, desktop text-base, dan large screen text-lg.
              Spacing dan leading juga disesuaikan untuk keterbacaan optimal.
            </p>
          </div>
        </section>

        {/* Image Grid Section */}
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-center">
            Gallery Responsif
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <div key={item} className="w-full aspect-square bg-gradient-to-br from-accent/20 to-accent/40 rounded-lg flex items-center justify-center">
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-accent">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-card rounded-xl border p-4 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-12">
              Statistics Responsif
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
                  100+
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
                  Projects
                </div>
              </div>
              
              <div className="text-center space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
                  50K
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
                  Users
                </div>
              </div>
              
              <div className="text-center space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
                  99%
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
                  Uptime
                </div>
              </div>
              
              <div className="text-center space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent">
                  24/7
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
                  Support
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-8 sm:py-12 lg:py-16">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              Call to Action Responsif
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Button dan konten yang menyesuaikan dengan ukuran layar untuk pengalaman pengguna yang optimal
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12">
                Primary Action
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12">
                Secondary Action
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full bg-muted mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="text-center">
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              © 2024 Responsive Demo. Dibuat dengan Tailwind CSS breakpoints.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
