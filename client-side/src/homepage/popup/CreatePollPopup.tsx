import React, { ReactEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreatePollPopup } from "../../redux/slices/CreatePoll";
import Avatar from "../../assets/Avatar.png";
import PolliFy from "../../assets/PolliFy.png";
import { MdTranslate } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LuWrapText } from "react-icons/lu";
import { RootState } from "../../redux/store";
import { RxCrossCircled } from "react-icons/rx";

const durationOptions = {
  "1": "1",
  "2": "2",
  "30": "30",
};

const CreatePollPopup = () => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState<string[]>([]);
  const [pollQuestion, setPollQuestion] = useState<string>("");
  const [newOption, setNewOption] = useState<string>("");
  const [limitVote, setLimitVote] = useState<number>(1);
  const [selectedDuration, setSelectedDuration] = useState<string>(
    Object.keys(durationOptions)[0]
  );
  const [error, setError] = useState("");
  const communityId = useSelector((state: RootState) => state.community.inCommunityId);

  //giving input, add, delete options
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(event.target.value);
  };

  const handleOptionAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (newOption.trim() !== "") {
      setOptions((prevOptions: string[]) => [...prevOptions, newOption]);
      setNewOption("");
    }
  };

  const handleOptionDelete = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };
  //

  //close popup
  const handleClosePoll = () => {
    console.log("close pop up");
    dispatch(closeCreatePollPopup());
  };
  //

  //handle poll question, limit vote, duration
  const handlePollQuestionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPollQuestion(event.target.value);
  };

  const handleVoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimitVote(parseInt(event.target.value));
  };

  const handleDurationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDuration(event.target.value); // Update the duration state
  };

  //process duration here

  const handleProcessFormData = () => {
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
    });

    let durationToOffset;

    if (selectedDuration === "30") {
      durationToOffset = "+07:30";
    } else {
      durationToOffset = `+0${7 + parseInt(selectedDuration)}:00`;
    }

    console.log(currentTime);

    const duration = new Date(currentTime)
      .toISOString()
      .replace("Z", durationToOffset);

    const pollData = {
      pollQuestion,
      limitVote,
      duration,
      options,
    };

    return pollData;
  };

  const handleCreatePoll = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const apiUrl = "http://18.142.146.129:8080";
    const accessToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjaGFuIiwiZXhwIjoxNjg4NzU4OTM0fQ.mbBjvhOxWQ7C5Qo46zm0ACsqSgAgMYmDdUZkcsGxCSEZyJSeNwOkaznvymdcRCl3QA9yExf5fa2ilc_SV1nvDA";

    //process duration here

    const pollData = handleProcessFormData();

    console.log(pollData);


    try {
      const response = await fetch(`${apiUrl}/api/v1/poll/community/${communityId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(pollData),
      });


      if (response.ok) {
        console.log("Poll created successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        console.error("Failed to create the poll:", errorData.message);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className='cotainer flex flex-col gap-y-5 font-sans bg-white w-full h-full mr-5 lg:justify-end'>
      <div className='logo-profile-createPoll flex justify-between items-center mt-5 ml-5 mr-5 md:hidden lg:hidden lg:justify-end'>
        <div>
          <img src={PolliFy} alt='Profile 1' className='logo w-fit h-7' />
        </div>
        <div className='translate flex gap-x-2 pl-6 items-center sm:gap-x-3 lg:gap-x-5 lg:justify-end'>
          <MdTranslate className='w-6 h-6' />
          <IoMdNotificationsOutline className='w-6 h-6' />
          <h1 className='lg:text-[17px] lg:font-sans lg:font-bold'>TED</h1>
          <div className='relative'>
            <img
              src={Avatar}
              alt='Profile 1'
              className='w-8 h-8 rounded-full mr-2 border-2 border-blue-500'
            />
            <span className='bottom-0 left-6 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full'></span>
          </div>
        </div>
      </div>
      <div className='border border-gray-100 ml-5 mr-5 hd:hidden'></div>

      {/* The form */}
      <div className='h-screen fixed z-10 inset-0 overflow-y-auto flex items-center justify-center'>
        <div
          className='fixed z-10 inset-0 bg-gray-500 opacity-60'
          onClick={handleClosePoll}
        ></div>
        <form
          onSubmit={handleCreatePoll}
          className='w-full h-auto flex flex-col fixed z-20 bg-white p-4 md:w-3/6 md:px-8 md:pt-6 md:pb-8 md:mb-4 md:rounded-md md:shadow-md lg:w-2/6 lg:shadow-md'
        >
          <button className='absolute top-2 right-2' onClick={handleClosePoll}>
            <RxCrossCircled className='w-7 h-7 text-gray-400 hover:text-blue-custom' />
          </button>
          <div className='w-full flex justify-center items-center'>
            <h1 className='text-[#2D9CDB] text font-semibold'>Create Poll</h1>
          </div>
          <div className='w-full flex items-start pb-1'>
            <label className='text-gray-300 text-sm' htmlFor='question'>
              Question
            </label>
          </div>
          <input
            type='text'
            id='question'
            placeholder='Add question'
            value={pollQuestion}
            onChange={handlePollQuestionChange}
            className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
          />
          <br />

          <div className='w-full flex items-start pb-1'>
            <label className='text-gray-300 text-sm' htmlFor='question'>
              Poll Options
            </label>
          </div>
          <div className='w-full border rounded-md border-gray-300'>
            {options.map((option, index) => (
              <div
                key={index}
                className='w-full flex items-start border border-gray-100 relative'
              >
                <div className='w-full px-3 py-2 '>{option}</div>

                {options.map((option, index) => (
                  <div key={index}>
                    <LuWrapText
                      onClick={() => handleOptionDelete(index)}
                      className='absolute right-0 top-1 mr-3 mt-2'
                    />
                  </div>
                ))}
              </div>
            ))}
            <div className='w-full flex relative'>
              <input
                type='text'
                id='question'
                value={newOption}
                onChange={handleOptionChange}
                placeholder='Add Option'
                className='w-full px-2 py-2 border border-gray-100 focus:outline-none focus:border-blue-500'
              />
              <button
                className='w-30 text-center absolute right-0 top-1 p-1 mr-3'
                onClick={handleOptionAdd}
              >
                +
              </button>
            </div>
          </div>

          <br />
          <div className='w-full flex items-start pb-1'>
            <label className='text-gray-300 text-sm' htmlFor='choose'>
              Let user choose
            </label>
          </div>
          <select
            id='choose'
            className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            value={limitVote}
            onChange={handleVoteChange}
          >
            {/* <option value='free'>Freely</option> */}
            <option value='1'>1 Option</option>
            <option value='2'>2 Option</option>
            <option value='3'>3 Option</option>
          </select>
          {/* {limitVote && (
            <input
              type='text'
              placeholder='Enter custom option'
              className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            />
          )} */}
          <br />
          <div className='w-full flex items-start pb-1'>
            <label className='text-gray-300 text-sm' htmlFor='limit'>
              Time Limit
            </label>
          </div>
          <select
            id='limit'
            className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            value={selectedDuration}
            onChange={handleDurationChange}
          >
            {Object.entries(durationOptions).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
          {/* {(
            <input
              type='text'
              placeholder='Enter custom time limit'
              className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            />
          )} */}
          <br />
          {error && <p className='text-red-500 mb-2'>{error}</p>}
          <button
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold'
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreatePollPopup;
