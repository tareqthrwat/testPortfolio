import img1 from './imgs/لقطة شاشة 2025-09-06 150513.png';
import img2 from './imgs/لقطة شاشة 2025-09-06 150557.png';
import img3 from './imgs/لقطة شاشة 2025-09-06 155211.png';
import img4 from './imgs/لقطة شاشة 2025-09-06 160320.png';
import img5 from './imgs/لقطة شاشة 2025-09-06 161155.png';
import img6 from './imgs/لقطة شاشة 2025-09-06 161640.png';

export default function Sectionthre() {
    return (
        <>
            <section className="mt-10">
                <div className="w-full flex justify-center  p-7">
                    <h1 className="text-5xl text-amber-50">Projects</h1>
                </div>
                <div className="grid  grid-cols-1 md:grid-cols-2 ">
                    <div className='p-4'>
                        <div>
                            <img src={img1} alt="Furni – Furniture & Interior Design" className='rounded-xl' />
                        </div>
                        <div className='flex items-center justify-center flex-col '>
                            <h1 className='text-4xl'>Furni – Furniture & Interior Design</h1>
                            <h2 className='text-2xl'>HTML • CSS • Bootstrap</h2>
                        </div>
                        <div className='flex items-center justify-around mt-4'>
                            <a href="https://tareqthrwat.github.io/Final1/">
                                <button className='btn btn-soft btn-accent'>VIEW PROJECT</button>
                            </a>
                            <a href="https://github.com/tareqthrwat/Final1">
                                <button className='btn btn-soft btn-accent'>VIEW CODE</button>
                            </a>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div>
                            <img src={img2} alt="Shopping Card Mobile" className='rounded-xl' />
                        </div>
                        <div className='flex items-center justify-center flex-col'>
                            <h1 className='text-4xl'>Shopping Card Mobile</h1>
                            <h2 className='text-2xl'>HTML • Bootstrap</h2>

                        </div>
                        <div className='flex items-center justify-around mt-4'>
                            <a href="https://tareqthrwat.github.io/bootstrap/">
                                <button className='btn btn-outline'>VIEW PROJECT</button>
                            </a>
                            <a href="https://github.com/tareqthrwat/bootstrap">
                                <button className='btn btn-outline'>VIEW CODE</button>
                            </a>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div >
                            <img src={img3} alt="" className='rounded-xl' />
                        </div>
                        <div className='flex items-center justify-center flex-col'>
                            <h1 className='text-4xl'>To Do Lest App</h1>
                            <h2 className='text-2xl'>HTML • Bootstrap • Javascript</h2>
                        </div>
                        <div className='flex items-center justify-around mt-4'>
                            <a href="https://tareqthrwat.github.io/projectdom1/">
                                <button className='btn btn-soft btn-primary'>VIEW PROJECT</button>
                            </a>
                            <a href="https://github.com/tareqthrwat/projectdom1">
                                <button className='btn btn-soft btn-primary'>VIEW CODE</button>
                            </a>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div>
                            <img src={img4} alt="" className='rounded-xl' />
                        </div>
                        <div className='flex items-center justify-center flex-col'>
                            <h1 className='text-4xl'>Card Shop system</h1>
                            <h2 className='text-2xl'>HTML • Bootstrap • Javascript</h2>
                        </div>
                        <div className='flex items-center justify-around mt-4'>
                            <a href="https://tareqthrwat.github.io/dom/">
                                <button className='btn btn-soft btn-error'>VIEW PROJECT</button>
                            </a>
                            <a href="https://github.com/tareqthrwat/dom">
                                <button className='btn btn-soft btn-error'>VIEW CODE</button>
                            </a>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div>
                            <img src={img5} alt="" className='rounded-xl' />
                        </div>
                        <div className='flex items-center justify-center flex-col'>
                            <h1 className='text-4xl'>Card Shop system</h1>
                            <h2 className='text-2xl'>React • Bootstrap </h2>
                        </div>
                        <div className='flex items-center justify-around mt-4'>
                            <a href="https://projectreact1-gjcm-87htv4nxd-tareks-projects-343b86d1.vercel.app/">
                                <button className='btn btn-outline btn-warning'>VIEW PROJECT</button>
                            </a>
                            <a href="https://github.com/tareqthrwat/projectreact1">
                                <button className='btn btn-outline btn-warning'>VIEW CODE</button>
                            </a>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div>
                            <img src={img6} alt="" className='rounded-xl' />
                        </div>
                        <div className='flex items-center justify-center flex-col'>
                            <h1 className='text-4xl'>Card Shop system</h1>
                            <h2 className='text-2xl'>React • Tailwind CSS </h2>
                        </div>
                        <div className='flex items-center justify-around mt-4'>
                            <a href="https://tailwint-cp3c-4o37hen69-tareks-projects-343b86d1.vercel.app/">
                                <button className='btn btn-outline btn-info'>VIEW PROJECT</button>
                            </a>
                            <a href="https://github.com/tareqthrwat/tailwint">
                                <button className='btn btn-outline btn-info'>VIEW CODE</button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            
        </>
    )
}