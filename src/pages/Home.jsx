import { useState } from "react";
import Hero from "../sections/home/Hero";
import BrandStory from "../sections/home/BrandStory";
import FeaturedCollection from "../sections/home/FeaturedCollection";
import TheAtelier from "../sections/home/TheAtelier";
import Testimonials from "../sections/home/Testimonials";
import Newsletter from "../sections/home/Newsletter";

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <main>
      <Hero onReady={() => setHeroReady(true)} />
      {heroReady && (
        <>
          <BrandStory />
          <FeaturedCollection />
          <TheAtelier />
          <Testimonials />
          <Newsletter />
        </>
      )}
    </main>
  );
}
