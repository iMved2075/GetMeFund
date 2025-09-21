import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="flex justify-center text-white flex-col items-center p-10 gap-5">
        <div className="flex gap-2 items-center font-bold text-5xl"> FUND ME <span><img src="./coin_bounce.gif" alt="coin_gif" width={60} /></span></div>
        <p>
          A crowdfunding platform for creators. Get funded by a large global community. Start Now!
        </p>
        <div className="flex gap-5 py-10">
          <Link href="/login">
            <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2">Start Now</button>
          </Link>
          <Link href="/About">
            <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2">Read More</button>
          </Link>
        </div>
      </div>
      <div className="bg-cyan-700 h-1 opacity-20">
      </div>
      <div className="text-white container mx-auto pt-10 pb-20 px-15">
        <h2 className="text-3xl font-bold text-center mb-20">Your fans can support you.</h2>
        <div className="flex gap-5 justify-around">
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <img className="bg-slate-400 rounded-full p-2 text-black" width={80} src="/man.gif" alt="man" />
            <p className="font-bold">Fund Yourself</p>
            <p> Get the resources you need to bring your project to life.</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <img className="bg-slate-400 rounded-full p-2 text-black" width={80} src="/coin_flip.gif" alt="man" />
            <p className="font-bold">Get Donations</p>
            <p> Connect with backers who want to support your vision.</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <img className="bg-slate-400 rounded-full p-2 text-black" width={80} src="/group.gif" alt="man" />
            <p className="font-bold">Your supporters want to help</p>
            <p> Leverage your community to gain traction and funding.</p>
          </div>
        </div>
      </div>
      <div className="bg-cyan-700 h-1 opacity-20">
      </div>
      <div className="flex flex-col justify-center items-center text-white container mx-auto pt-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-20">Learn more about us.</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/KOaeDHeJ80I?si=fGHdg9d9YwO165xX" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
    </>
  );
}
