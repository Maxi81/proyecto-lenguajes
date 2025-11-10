import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Navbar } from "@/components/Navbar";
import { Amenities } from "@/components/amenities";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>
      <div className="flex-1 w-full flex flex-col items-center">
        <Hero />
        <div className="w-full flex-1 flex flex-col">
          <Amenities />
        </div>

        <Footer />
      </div>
    </main>
  );
}
