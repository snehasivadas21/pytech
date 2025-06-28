import Banner from "../components/Banner"
import CourseSection from "../components/CourseSection";
import Achievements from "../components/Achievements";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <>
      <Banner/>
      <CourseSection/>
      <Features/>
      <Testimonials/>
      <Achievements />
    </>
  );
};

export default Home;
