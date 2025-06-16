import Header from "../components/common/Header";
import Banner from "../components/Banner";
import Feature from "../components/Feature";
import Learning from "../components/Learning";
import Footer from "../components/common/Footer";
import SpecialCourse from "../components/SpecialCourse";
function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <Feature />
      <Learning />
      <SpecialCourse/>
      <Footer />
    </div>
  );
}

export default Home;
