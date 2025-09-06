import tarek from './صورة_واتساب_بتاريخ_2025-06-25_في_13.25.26_82af64fd-removebg-preview.png';
import TextType from './TextType';
import { IoLogoGithub } from "react-icons/io5";
import { FaLinkedin, FaInstagram, FaFacebookSquare } from "react-icons/fa";
export default function Sectionone() {
    return (
        <>
            <section className="  grid grid-cols-1 lg:grid-cols-2  ">
                <div className="  flex flex-col items-center justify-center gap-6">
                    <div className=" bg-[#101010]  w-[60%] rounded-xl">
                        <img src={tarek} alt="" className=" w-[100%] " />
                    </div>
                    <div className=" flex gap-3 mt-0.5">
                        <button className='btn btn-ghost'>
                            <a href="https://github.com/tareqthrwat">
                                <IoLogoGithub className="text-4xl text-amber-50 hover:text-blue-600" />
                            </a>
                        </button>
                        <button className='btn btn-ghost'>
                            <a href="https://www.linkedin.com/in/tarek-thrwat-328aa8325/">
                                <FaLinkedin className="text-4xl text-amber-50 hover:text-blue-600" />
                            </a>

                        </button>
                        <button className='btn btn-ghost'>
                            <a href="https://www.instagram.com/tarek_thrwat/">
                                <FaInstagram className="text-4xl text-amber-50 hover:text-pink-700" />
                            </a>
                        </button>
                        <button className='btn btn-ghost'>
                            <a href="https://www.facebook.com/tarek.tato.5439?locale=ar_AR">
                                <FaFacebookSquare className="text-4xl text-amber-50 hover:text-blue-600" />
                            </a>
                        </button>
                    </div>
                </div>
                <div>
                    <div className=' grid grid-cols-1 gap-6'>
                        <h1 className='text-7xl text-amber-50'>Nice to meet you!</h1>
                        <TextType className='text-amber-500 text-6xl'
                            text={[" I'm Tarek thrwat", " front end developer"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="|"
                        />
                        <p className='text-3xl'>"I’m a front-end developer from Egypt, passionate about creating modern, responsive, and user-friendly web applications that deliver enjoyable experiences and leave a lasting impression."</p>

                    </div>
                </div>
            </section>
        </>
    )
}