import HeroSection from "../components/home/HeroSection";
import Info from "../components/home/Info";
import InputBox from "../components/home/InputBox";
import Logos from "../components/home/Logos";
import Slider from "../components/home/Slider";
import Tabs from "../components/home/Tabs";

const Home = () => {
  return (
    <main>
      <HeroSection />
      <Tabs />
      <Info />
        <Slider />
      <Logos />
      <InputBox />
    </main>
  );
};

export default Home;
