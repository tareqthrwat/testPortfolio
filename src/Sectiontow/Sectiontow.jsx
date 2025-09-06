export default function Sectiontow() {
    return (
        <>
            <div className="w-full h-0.5 bg-amber-50 mt-6 mb-6"></div>
            <section className="">
                <div className="w-full flex justify-center">
                    <h1 className="text-4xl text-amber-50">My skills</h1>
                </div>

                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    <div className=" mt-8  flex items-center justify-center">
                        <h1 className=" text-4xl text-amber-50"> HTML</h1>
                    </div>
                    <div className=" mt-8  flex items-center justify-center">
                        <h1 className=" text-4xl text-amber-50"> CSS</h1>
                    </div>
                    <div className=" mt-8  flex items-center justify-center">
                        <h1 className=" text-4xl text-amber-50">Javascript</h1>
                    </div>
                    <div className=" mt-8  flex items-center justify-center">
                        <h1 className=" text-4xl text-amber-50"> Tailwind , Bootstrap</h1>
                    </div>
                    <div className=" mt-8  flex items-center justify-center">
                        <h1 className=" text-4xl text-amber-50">React</h1>
                    </div>
                    <div className=" mt-8  flex items-center justify-center">
                        <h1 className=" text-4xl text-amber-50"> SOON (Next.js)</h1>
                    </div>
                </div>

            </section>
        </>
    )
}