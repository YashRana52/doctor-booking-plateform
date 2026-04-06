import AuthRedirect from "@/components/auth/AuthRedirect";
import Brand from "@/components/landing/Brand";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import LandingHero from "@/components/landing/LandingHero";
import Testimonial from "@/components/landing/Testimonial";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <AuthRedirect />

      <Header showDashBoardNav={false} />

      <main className="pt-16">
        <LandingHero />
        <Testimonial />
        <Brand />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}

export default Home;
