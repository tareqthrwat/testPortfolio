import Sectionone from './Sectionone/section';
import Sectiontow from './Sectiontow/Sectiontow';
import Sectionthre from './Sectionthree/Sectionthre';
import Footer from './footar/footer';
export default function App(){
  return(
    <div className="flex items-center justify-center bg-black w-[100%]">
      <div className=" container p-5  ">
        <Sectionone/>
        <Sectiontow/>
        <Sectionthre/>
        <Footer/>
      </div>
    </div>
  )
}