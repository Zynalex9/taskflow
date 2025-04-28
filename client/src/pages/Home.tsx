import HeroSection from "../components/home/HeroSection";
import Info from "../components/home/Info";
import Slider from "../components/home/Slider";
import Tabs from "../components/home/Tabs";

const Home = () => {
  return (
    <main>
      <HeroSection />
      <Tabs/>
      <Info/>
      <Slider/>
    </main>
  );
};

export default Home;
