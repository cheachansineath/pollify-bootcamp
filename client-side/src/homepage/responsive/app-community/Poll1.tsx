import React, { useState, useEffect } from "react";
import { FcPieChart } from "react-icons/fc";
import { AiFillCheckCircle } from "react-icons/ai";
import api from "../../../utils/api";
import Alert from "../../../components/Popup/Alert";
import Moment from "react-moment";
import { apiURL } from "../../../config/config";
import { Poll } from "../../../types/redux/create_poll";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

function Poll1({ pollId, duration }: any) {
  // poll state
  const [pollData, setPollData] = useState<Poll | null>(null);

  const { email } = useSelector((state: RootState) => state.userCommunity);

  

  //get current time of poll creation

  const timeNow = new Date().toISOString();
  const now = new Date().toLocaleString(); //debug
  const splittedTime = timeNow.split("+")[0];
  const creationTime = splittedTime.replace("Z", "+00:00");
  const getDuration = duration; //debug

  // console.log(`Creation Time:\nnow: ${now},\ntimenow: ${timeNow},\nst: ${splittedTime},\nct: ${creationTime}`)
  // console.log(`Poll Duration: \ngetDuration: ${getDuration}\n`)
  


  // This function is used to convert the duration's custom format to normal locale string format
  //

  const reverseCustomFormat = (customFormat: string) => {
    try {
      const timezoneOffset = customFormat.split("+")[1];
      const splittedTime = customFormat.split("+")[0];
      const dateTime = splittedTime + "Z";
      const hours = parseInt(timezoneOffset.slice(0, 2));
      const minutes = parseInt(timezoneOffset.slice(3));
      const currentTime = new Date(dateTime);

      currentTime.setHours(currentTime.getHours() + hours);
      currentTime.setMinutes(currentTime.getMinutes() + minutes);

      return currentTime.toLocaleString();
    } catch (error) {
      console.error("Error in reverseCustomFormat:", error);
      return "Invalid date format";
    }
  };

  // const calculateTimeDifference = () => {
  //   const pollDateInMillis = new Date(
  //     reverseCustomFormat(creationTime)
  //   ).getTime();
  //   const pollDateNormal = new Date(reverseCustomFormat(creationTime));

  //   const durationInMillis = new Date(reverseCustomFormat(duration)).getTime();
  //   const durationNormal = new Date(reverseCustomFormat(duration)).getTime();
  //   const timeDifferenceInMillis = durationInMillis - pollDateInMillis;

  //   // console.log(
  //   //   `PollDate: ${pollDateNormal}
  //   // \nPollDateMs: ${pollDateInMillis}
  //   // \nDuration: ${durationNormal}
  //   // \nDurationMs: ${durationInMillis}
  //   // \nTimeDiffMs: ${timeDifferenceInMillis}`)

  //   return timeDifferenceInMillis;
  // };

  // Show Alert message
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<any>("success");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  // Store countdown intervals for each poll separately
  const [pollCountdownIntervals, setPollCountdownIntervals] = useState<
    Record<number, number | NodeJS.Timeout | null> // Update the type here
  >({});

  const calculateTimeDifference = () => {
    const pollDateInMillis = new Date(reverseCustomFormat(creationTime)).getTime();
    const durationInMillis = new Date(reverseCustomFormat(duration)).getTime();
    return durationInMillis - pollDateInMillis;
  };

  useEffect(() => {
    const timeDifferenceInMillis = calculateTimeDifference();
    const timeRemaining = timeDifferenceInMillis / (60 * 1000);

    setTimeRemaining(timeRemaining);
    setPollCountdownIntervals((prevIntervals) => ({
      ...prevIntervals,
      [pollId]: null, // Initialize the interval ID as null for this poll
    }));
  }, [pollId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 60000); // Update the countdown every 1 minute (60,000 milliseconds)

      // Store the interval ID in the pollCountdownIntervals state object
      setPollCountdownIntervals((prevIntervals) => ({
        ...prevIntervals,
        [pollId]: interval,
      }));
    } else {
      // Clear the interval if the countdown has reached 0
      const intervalId = pollCountdownIntervals[pollId];
      if (typeof intervalId === "number") {
        clearInterval(intervalId);
      }
    }
  }, [timeRemaining, pollId, setPollCountdownIntervals]);



  // update real time data with SSE
  useEffect(() => {
    const sse = new EventSource(
      `${apiURL}/poll/stream/${pollId}?email=${email}`
    );

    sse.onmessage = (e) => {
      // Handle incoming SSE messages
      const pollData = JSON.parse(e.data);
      setPollData(pollData);
    };

    sse.onerror = (error) => {
      // Handle incoming SSE error
      // console.error("SSE connection error:", error);
    };

    return () => {
      // Cleanup: close the SSE connection when the component unmounts
      sse.close();
    };
  }, []);

  // Option Click handler
  const handleOptionClick = async (optionId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `${accessToken}`,
    };
    const body = {
      option_id: [optionId],
    };
    try {
      const response = await api.post(`/vote/poll/${pollId}`, body, {
        headers,
      });
      if (response.status === 200) {
        // setNewOption(response.data.options);
        setAlertType("success");
        setShowAlert(true);
        setAlertMessage("You have voted successfully!");
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setAlertType("error");
      setShowAlert(true);
      setAlertMessage("You can only vote once per poll!");
      setTimeout(function () {
        setShowAlert(false);
        setAlertMessage("");
      }, 4000);
    }
  };

  return (
    <div className='poll1 flex flex-col border h-fit bg-white rounded-md p-5'>
      <Alert variant={alertType} message={alertMessage} showAlert={showAlert} />
      <div className='userChart flex justify-between items-center'>
        <div className='User flex items-center w-full'>
          {/* <img
            src={Avatar}
            alt="Profile 1"
            className="w-10 h-10 rounded-full mr-2 border-2 border-blue-500"
          /> */}
          <div className='relative flex justify-center items-center w-12 h-12 rounded-full mr-3 border border-blue-500'>
            <span className='font-bold text-2xl uppercase'>
              {pollData?.user.createdBy.slice(0, 2)}
            </span>
            <span className='absolute bottom-0 left-8 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></span>
          </div>
          <div className='mt-1'>
            <h5 className='text-md leading-none font-semibold'>
              {pollData?.user.createdBy}
            </h5>
            <small>
              <Moment className='leading-none' format='Do MMMM YYYY'>
                {pollData?.pollDate}
              </Moment>
            </small>
          </div>
        </div>
        {/* Time Remaining */}
        <div className='timeRemaining'>
          {timeRemaining > 0 ? (
            <>
              <p>{Math.ceil(timeRemaining)} Minutes Left</p>{" "}
              {/* Using Math.ceil to round up */}
              <div
                style={{ width: `${(timeRemaining / duration) * 100}%` }}
                className={`timeRemainingBar ${
                  timeRemaining <= duration * 0.1 ? "red" : ""
                }`}
              />
            </>
          ) : (
            <p style={{ color: "red" }}>Time is Up!</p>
          )}
        </div>
        {/* Time Remaining End */}
      </div>
      <p className='mt-5 font-light text-[15px] md:text-[17px]'>
        {pollData?.pollQuestion}
      </p>
      <div className='food-menu grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-5 text-gray-800'>
        {pollData?.options.map((option: any) => {
          const optionDisabled = timeRemaining <= 0;
          return (
            <div
              key={option.id}
              onClick={
                optionDisabled
                  ? () => {
                      {
                        setAlertType("error");
                        setShowAlert(true);
                        setAlertMessage(
                          "Voting has ended. You cannot vote anymore."
                        );
                        setTimeout(function () {
                          setShowAlert(false);
                          setAlertMessage("");
                        }, 4000);
                        return;
                      }
                    }
                  : () => handleOptionClick(option.id)
              }
              className={`flex items-center gap-x-2 text-[15px] font-sans font-bold border shadow px-4 py-3 rounded-xl hover:bg-blue-100 hover:cursor-pointer ${
                pollData?.votedOn === option.id &&
                "bg-blue-100 border-blue-custom"
              }`}
              style={{ cursor: optionDisabled ? "not-allowed" : "pointer" }}
            >
              {pollData?.votedOn === option.id ? (
                <AiFillCheckCircle className='w-5 h-5 text-blue-custom' />
              ) : (
                <span
                  className='w-4 h-4 flex items-center justify-center rounded-full 
                  border border-gray-400'
                ></span>
              )}
              {option.optionText}
            </div>
          );
        })}
      </div>
      <div className='progress-bar  mt-7'>
        {pollData?.options.map((option: any) => {
          return (
            <div key={option.id}>
              <div className='mb-1 text-base font-mediu flex justify-between items-center'>
                <h1 className='text-[12px] text-gray-800 md:text-[15px]'>
                  {option.optionText}
                </h1>
                <h1 className='text-[12px] font-semibold text-blue-custom md:text-[15px]'>
                  {Number.isInteger(option.percentage * 100)
                    ? (option.percentage * 100).toFixed(0) + "%"
                    : (option.percentage * 100).toFixed(2) + "%"}
                </h1>
              </div>
              <div className='w-full bg-blue-100 rounded-full h-3 mb-2'>
                {option.percentage === 0 ? (
                  <div className='w-3 bg-blue-custom h-full rounded-full'></div>
                ) : (
                  <div
                    style={{ width: `${option.percentage * 100}%` }}
                    className='bg-blue-custom h-full rounded-full'
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className='btn-delete flex justify-start items-center mt-2'>
        <button className='font-sans border border-blue-custom px-4 py-2 rounded-full flex items-center gap-x-1 w-fit'>
          <span className='text-blue-custom'>
            {pollData?.totalVote ?? 0}{" "}
            {pollData?.totalVote && pollData.totalVote > 1 ? "votes" : "vote"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default Poll1;
