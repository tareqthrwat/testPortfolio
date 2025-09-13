import tarek from './صورة_واتساب_بتاريخ_2025-06-25_في_13.25.26_82af64fd-removebg-preview.png';
import TextType from './TextType';
import { IoLogoGithub } from "react-icons/io5";
import { FaLinkedin, FaInstagram, FaFacebookSquare } from "react-icons/fa";
export default function Sectionone() {
    return (
        <>
            <section className="  grid grid-cols-1 lg:grid-cols-2  ">
                <div className='flex items-center justify-center'>
                    <div className="  flex flex-col items-center justify-center gap-6 shadow-xl  shadow-gray-700 w-[60%] rounded-xl">
                        <div className=" bg-[#101010]  w-[100%] rounded-xl">
                            <img src={tarek} alt="" className=" w-[100%] " />
                        </div>
                        <div className=" flex gap-3  ">
                            {/* <button className='btn btn-ghost'>
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
                            </button> */}

                            <div className="grid grid-cols-4 p-4 gap-6 max-w-md mx-auto">
                                <button
                                    className="p-5 rounded-full backdrop-blur-lg border border-white/10 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-white/30 hover:bg-gradient-to-tr hover:from-white/10 hover:to-black/40 group relative overflow-hidden"
                                >
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                                    ></div>
                                    <div className="relative z-10 flex items-center justify-center">
                                        <a href="https://github.com/tareqthrwat">
                                            <IoLogoGithub className="text-4xl text-amber-50 hover:text-blue-600" />
                                        </a>
                                    </div>
                                </button>

                                <button
                                    className="p-5 rounded-full backdrop-blur-lg border border-green-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-green-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-green-500/50 hover:bg-gradient-to-tr hover:from-green-500/10 hover:to-black/40 group relative overflow-hidden"
                                >
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                                    ></div>
                                    <div className="relative z-10 flex items-center justify-center">
                                        <a href="https://www.linkedin.com/in/tarek-thrwat-328aa8325/">
                                            <FaLinkedin className="text-4xl text-amber-50 hover:text-blue-600" />
                                        </a>
                                    </div>
                                </button>

                                <button
                                    className="p-5 rounded-full backdrop-blur-lg border border-indigo-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-110 hover:-rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-indigo-500/50 hover:bg-gradient-to-tr hover:from-indigo-500/10 hover:to-black/40 group relative overflow-hidden"
                                >
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                                    ></div>
                                    <div className="relative z-10 flex items-center justify-center">
                                       
                                         <a href="https://www.facebook.com/tarek.tato.5439?locale=ar_AR">
                                            <FaFacebookSquare className="text-4xl text-amber-50 hover:text-blue-600" />
                                        </a>
                                    </div>
                                </button>

                                <button
                                    className="p-5 rounded-full backdrop-blur-lg border border-red-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-red-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-red-500/50 hover:bg-gradient-to-tr hover:from-red-500/10 hover:to-black/40 group relative overflow-hidden"
                                >
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                                    ></div>
                                    <div className="relative z-10 flex items-center justify-center">
                                        <a href="https://www.instagram.com/tarek_thrwat/">
                                            <FaInstagram className="text-4xl text-amber-50 hover:text-pink-700" />
                                        </a>
                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
                <div>
                    <div className=' grid grid-cols-1 gap-6 p-5'>
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