import React from "react";
import Avatar from "../../assets/Avatar.png";
import { MdClear } from "react-icons/md";
import Avatar1 from "../../assets/userProfile/Avatar-1.png";
import Avatar2 from "../../assets/userProfile/Avatar-2.png";
import Avatar3 from "../../assets/userProfile/Avatar-3.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { TiDelete } from "react-icons/ti";
import { HiOutlineCamera } from "react-icons/hi";
import { RxCrossCircled } from "react-icons/rx";
import { setSearchTerm } from "../../redux/slices/Community";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const clearIcons = {
  color: "white",
  fontSize: "20px",
};

const AddPermission: React.FC<PopupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();

  const { communityMembers, searchTerm } = useSelector(
    (state: RootState) => state.community
  );

  console.log(communityMembers);
  const handleSubmit = () => {
    console.log("Submit");
  };

  return (
    <div className="h-screen fixed z-20 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="fixed z-20 inset-0 bg-gray-500 opacity-60"></div>
      <form
        onSubmit={handleSubmit}
        className="fixed z-20 flex flex-col justify-between lg:justify-center items-start bg-white lg:px-3 px-6  py-6 w-full h-full lg:h-auto lg:w-2/5 rounded-lg"
      >
        {/* <div className="flex flex-col w-full justify-center items-center">
          <h1 className=" text-blue-custom text-lg mb-4">Add Permission</h1>
          <button className="absolute top-6 right-7">
            <RxCrossCircled className="w-7 h-7 text-gray-400 hover:text-blue-custom" />
          </button>
        </div> */}
        <div className="w-full">
          <div className="flex flex-col w-full justify-center items-center">
            <h1 className=" text-blue-custom text-lg mb-4">Add Permission</h1>
            <button className="absolute top-6 right-4 lg:right-7">
              <RxCrossCircled className="w-7 h-7 text-gray-400 hover:text-blue-custom" />
            </button>
          </div>
          <span className="text-gray-400">Search User</span>
          <input
            id="search_user"
            className="text-gray-700 mt-2 py-2 px-4 w-full rounded border-2 border-neutral-300 focus:outline-none"
            type="email"
            placeholder="Type email..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
          <div className="flex flex-col justify-start mt-4">
            <span className="text-gray-400">Pollers</span>
            <div
              id="user"
              className={`flex flex-wrap w-auto gap-2 mt-2 overflow-auto`}
            >
              {/* {invitedUsers.map((user, index) => { */}
              {/* return (
                <React.Fragment key={index}> */}
              <div className="flex flex-row items-center pl-1 h-8 space-x-2 w-auto border border-blue-custom rounded-full">
                <img className="w-6 h-6" src={Avatar2} alt="" />
                <p className="text-sm text-blue-custom">POV</p>
                <button type="button">
                  <TiDelete className="text-blue-custom w-6 h-6" />
                </button>
              </div>
              {/* </React.Fragment>
              ); */}
              {/* })} */}
            </div>
          </div>
          <div className="w-full mt-4 lg:h-44 overflow-auto">
            {communityMembers
              .filter((user) => {
                return searchTerm.toLocaleLowerCase() === ""
                  ? user
                  : user.email.includes(searchTerm);
              })
              .map((user, index) => {
                return (
                  <React.Fragment key={index}>
                    <button
                      type="button"
                      className="flex flex-row items-center space-x-3 w-full px-1 py-3 border-b border-gray-300"
                    >
                      <img className="w-8 h-8" src={Avatar3} alt="" />
                      <p className="text-sm text-black-secondary font-medium">
                        {user.username}
                      </p>
                    </button>
                  </React.Fragment>
                );
              })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-white font-bold bg-blue-custom rounded mt-4 py-3 hover:opacity-70"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddPermission;
