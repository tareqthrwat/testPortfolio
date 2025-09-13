import { IoLogoGithub } from "react-icons/io5";
import { FaLinkedin, FaInstagram, FaFacebookSquare } from "react-icons/fa";
export default function Footer() {
    return (
        <>
            <footer className="p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-6xl text-amber-50">Contact</h1>
                        <p className="text-3xl">
                            I would love to hear about your project and how I could help. Please fill in the form, and I’ll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 p-4">
                        <label className="input validator w-full">
                            <svg
                                className="h-[1em] opacity-50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                type="text"
                                required
                                placeholder="Your Name"
                                pattern="[A-Za-z][A-Za-z0-9\\-]*"
                                minLength={3}
                                maxLength={30}
                                title="Only letters, numbers or dash"
                            />
                            <p className="validator-hint">
                                Must be 3 to 30 characters
                                <br />
                                containing only letters, numbers or dash
                            </p>
                        </label>

                        <label className="input validator w-full">
                            <svg
                                className="h-[1em] opacity-50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input type="email" placeholder="mail@site.com" required />
                            <div className="validator-hint hidden">Enter valid email address</div>
                        </label>

                        <textarea
                            placeholder="MESSAGE"
                            className="textarea textarea-xl w-full"
                        ></textarea>

                        <div className="flex justify-end">
                            <button className="btn btn-dash btn-accent">SEND MESSAGE</button>
                        </div>
                    </div>
                </div>

                <div className="mt-7">
                    <div className="w-full h-0.5 bg-amber-50"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
                        <div>
                            <h1 className="text-3xl">Tarek Thrwat</h1>
                        </div>
                        <div className=" flex   justify-end">
                            <div className="grid grid-cols-4  gap-6 max-w-md mx-auto">
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
            </footer>

        </>
    )
}