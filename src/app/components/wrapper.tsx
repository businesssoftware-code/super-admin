import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";



const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Navbar/>
      <div id="modal-root"></div>
      <div className="flex flex-1 overflow-hidden gap-10 p-4">
        {/* Sidebar + AM Graphic */}
        <div className="relative flex flex-col flex-shrink-0">
          <Sidebar/>

          {/* AM Character with Caption */}
          {/* <div className="absolute bottom-[-20px] left-[-20px] flex items-center gap-2 pl-4">
            <div className="relative h-[280px] w-[160px] flex-shrink-0">
              <Image src="/images/am-man.png" alt="am-man" fill />
            </div>
            <p className="text-primary text-bodyLarge w-[141px] leading-tight relative right-[80px]">
              Hey Manager, <br />
              Let’s blend fresh <br />
              talent into winning teams!
            </p>
          </div> */}
        </div>

        {/* Main Content (Scroll Area) */}
        <div className="flex-1 overflow-y-auto pr-4 pl-2 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Wrapper;
