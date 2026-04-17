import React from "react";
import CenteredDropdown from "./CenteredDropdown";
import Filter from "./Filter";

function Sidebar() {
  return (
    <div className="w-full md:w-[180px] h-auto pt-[50px] px-5 md:px-0 font-redhat">
      <div className="w-full h-full flex flex-col gap-4">

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-gray-700">
            Filter By
          </label>
          <Filter />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-gray-700">
            Sort By
          </label>
          <CenteredDropdown />
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
