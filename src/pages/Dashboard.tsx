import { Input } from "@/components/ui/input";
import Img1 from "../../src/assets/img1.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
//import Img2 from "../../src/assets/img2.jpg";

const Dashboard = () => {
  const [load, setLoad] = useState(false);
  const [conversationsArr, setConversationsArr] = useState([]);
  const [messages, setMessages] = useState({});
  const [user, setUser] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [usersArr, setUsersArr] = useState([]);
  const [socket, setSocket] = useState(null);
  //const usersArr = ["dsa"];
  //const deployedUrl = "https://chat-app-wnta.onrender.com";
  //const deployedUrl = "http://localhost:8000";
  //const localUrl = "http://localhost:8000";
  const deployedUrl ="https://ec2-3-110-42-202.ap-south-1.compute.amazonaws.com";
  useEffect(() => {
    const socket = io(deployedUrl);
    setSocket(socket);
  }, []);
  useEffect(() => {
    (async function () {
      try {
        if (localStorage.getItem("user")) {
          const userObj = JSON.parse(localStorage.getItem("user"));
          setUser(userObj.user);
          const response = await axios.get(
            deployedUrl + `/conversations/${userObj.user.id}`
          );
          const responseUsers = await axios.get(deployedUrl + `/users`);
          console.log(response.data);
          console.log(user);
          console.log(responseUsers.data);
          setUsersArr(responseUsers.data);
          setConversationsArr(response.data);
        }
      } catch (err) {
        console.log(err.response.data);
      }
    })();
    setLoad(true);
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log("activeUsers :>> ", users);
    });
    socket?.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
  }, [socket]);

  const handleMessages = async (conversationId, receiver) => {
    try {
      const response = await axios.get(
        deployedUrl +
          `/messages/${conversationId}?senderId=${user?.id}&&receiverId=${receiver.user?.receiverId}`
      );
      // setReceiverName(receiver.user.fullName);
      setReceiverName(receiver);
      console.log(response.data);
      // console.log(receiverName);
      setMessages({ messages: response.data, receiver, conversationId });
      console.log(messages);
      console.log(receiver.user?.receiverId);
      console.log(receiver);
      setLoad(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  // const createNewConversation=async(senderId,receiverId)=>{
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8000/conversations`,
  //       {
  //         senderId: senderId,
  //         receiverId: receiverId,
  //       }
  //     );
  //     const convData = await axios.get(`http://localhost:8000/conversations/${user.id}`);
  //     console.log(response.data)
  //   } catch (err) {
  //     console.log(err.response.data);
  //   }

  // }
  const sendMessage = async (e) => {
    console.log(e.key)
    if(e.key && e.key!=="Enter")
      return
    e.preventDefault();
    try {
      socket?.emit("sendMessage", {
        senderId: user.id,
        receiverId: messages.receiver.user.receiverId,
        message: inputMessage,
        conversationId: messages.messages[0].user.conversationId,
      });
      console.log(messages.receiver.user.receiverId);
      console.log(messages);
      console.log(messages.messages[0].user.conversationId);
      const response = await axios.post(deployedUrl + `/messages`, {
        senderId: user.id,
        receiverId: messages.receiver.user.receiverId,
        message: inputMessage,
        // conversationId: messages.conversationId,
        conversationId: messages.messages[0].user.conversationId,
      });
      console.log(response.data);
      setInputMessage("");
      handleMessages(messages.conversationId, receiverName);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  return (
    <div className="h-screen w-screen bg-purple-300 flex">
      <div className="w-[25%] border border-red-100">
        <div className="flex justify-evenly items-center h-[20%]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="532"
            height="532"
            viewBox="0 0 532 532"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="w-[60px] h-[60px] rounded-full border border-primary p-[2px]"
          >
            <polygon
              points="379.19 379.04999 246.19 379.04999 246.19 199.04999 361.19 262.04999 379.19 379.04999"
              fill="#2f2e41"
            />
            <circle cx="270.76004" cy="260.93216" r="86.34897" fill="#ffb6b6" />
            <polygon
              points="221.19 360.04999 217.28893 320.61639 295.19 306.04999 341.19 418.04999 261.19 510.04999 204.19 398.04999 221.19 360.04999"
              fill="#ffb6b6"
            />
            <path
              d="M457.03998,451.08997c-.96997,1.01001-1.95996,2.01001-2.94995,3-3.14001,3.14001-6.34003,6.19-9.61005,9.15002-49,44.44-111.87,68.76001-178.47998,68.76001-61.40997,0-119.64001-20.67004-166.75-58.72003-.02997-.02002-.04999-.03998-.08002-.07001-1.42999-1.14996-2.83997-2.32001-4.25-3.51001,.25-.71997,.52002-1.42999,.79004-2.13,15.14996-39.46997,45.07001-58.77997,63.22998-67.22998,9-4.19,15.10999-5.71997,15.10999-5.71997l21.32001-38.40002,15.01001,28,11.06,20.64001,45.38,84.66998,39.15002-97.47998,12.12994-30.22003,3.11005-7.73999,14.78998,11.51001,14,10.89001,28.19,6.21997,22.87,5.04999,31.06,6.86005c12.56,10.22998,20.20001,29.69,24.47003,53.87,.15997,.85999,.31,1.72998,.44995,2.59998Z"
              fill="#6c63ff"
            />
            <path
              d="M225.33945,162.80316c10.51816-17.66798,29.83585-29.79031,50.31992-31.577,20.48407-1.78667,41.60876,6.80817,55.02692,22.38837,7.99588,9.28423,13.23862,20.65456,21.03256,30.10893,16.77231,20.3455,45.37225,32.2415,52.69913,57.57068,3.19727,11.05298,1.6041,22.85326-.01367,34.24507-1.3866,9.76407-2.77322,19.52817-4.15985,29.29224-1.0791,7.59863-2.11386,15.60931,.73538,22.73569,3.34277,8.36084,11.34241,13.83688,16.51462,21.20749,8.80081,12.54153,8.15744,30.90353-1.49963,42.79834-4.18805,5.15848-9.74042,9.04874-14.13116,14.03583s-7.64764,11.80563-5.80865,18.19058c3.52286,12.23126,22.70462,15.16449,24.80847,27.7179,1.07565,6.41818-3.35748,12.82758-9.1658,15.76245s-12.64572,3.02011-19.10587,2.23492c-24.55347-2.98438-47.28705-18.32629-59.24158-39.97961-11.95456-21.65335-12.82504-49.06561-2.26843-71.43384,8.67035-18.37146,24.78519-34.60559,24.60965-54.91949-.09564-11.0668-5.17172-21.4032-10.13535-31.29489-10.15924-20.24577-20.31851-40.49153-30.47775-60.7373-5.44196-10.84496-11.75745-22.53171-22.96112-27.19061-8.65872-3.60063-18.48325-2.20412-27.74442-.73141s-19.07155,2.90622-27.75604-.63181-15.24644-14.04982-11.1087-22.4651"
              fill="#2f2e41"
            />
            <path
              d="M240.47141,163.72575c-16.68272-5.49146-35.39705,3.32417-46.6913,16.77441-11.29425,13.45026-16.77287,30.70596-21.992,47.47588-2.98952,9.60582-5.97903,19.21164-8.96854,28.81747-2.81226,9.03625-5.6245,18.07248-8.43675,27.10873-3.30785,10.62869-6.64275,21.9205-3.92802,32.71591,1.96262,7.8046,7.01262,14.89124,7.12131,22.93808,.11353,8.40567-5.15047,15.7851-9.7636,22.81268-4.61311,7.02759-8.94347,15.37701-6.74557,23.49103,3.34306,12.34174,20.502,19.12564,19.56139,31.87747-.3139,4.25571-2.7749,8.19205-2.73022,12.45908,.05684,5.42914,4.30745,10.1203,9.2874,12.28336,4.97997,2.16306,10.5818,2.28052,16.01041,2.18506,16.65134-.29279,33.27257-2.27026,49.52779-5.89246,6.25403-1.39359,12.61382-3.10281,17.81967-6.83832s9.0894-9.92447,8.41191-16.29596c-1.05576-9.92862-11.73091-15.56143-17.11801-23.96805-5.29137-8.25723-5.16869-18.71957-7.45038-28.25763-3.13582-13.10846-10.88029-24.55249-16.69402-36.71249-21.85695-45.71606-14.20572-103.98718,18.71225-142.51109,2.91051-3.40616,6.0903-6.83273,7.30457-11.14532,1.21426-4.31261-.35107-9.80727-4.5697-11.31593"
              fill="#2f2e41"
            />
            <path
              d="M454.09003,77.90997C403.84998,27.66998,337.04999,0,266,0S128.15002,27.66998,77.90997,77.90997C27.66998,128.14996,0,194.94995,0,266c0,64.84998,23.04999,126.15997,65.28998,174.56995,4.03003,4.63,8.24005,9.14001,12.62,13.52002,1.03003,1.03003,2.07001,2.06,3.12006,3.06,2.79999,2.71002,5.64996,5.35999,8.54999,7.92999,1.76001,1.57001,3.53998,3.11005,5.33997,4.62,1.41003,1.19,2.82001,2.36005,4.25,3.51001,.03003,.03003,.05005,.04999,.08002,.07001,47.10999,38.04999,105.34003,58.72003,166.75001,58.72003,66.60999,0,129.47998-24.32001,178.47998-68.76001,3.27002-2.96002,6.47003-6.01001,9.61005-9.15002,.98999-.98999,1.97998-1.98999,2.94995-3,2.70001-2.77997,5.32001-5.60999,7.88-8.47998,43.37-48.72003,67.07999-110.84003,67.07999-176.60999,0-71.05005-27.66998-137.85004-77.90997-188.09003Zm10.17999,362.21002c-2.5,2.83997-5.06,5.63995-7.67999,8.37-4.08002,4.25-8.29004,8.37-12.64001,12.33997-1.65002,1.52002-3.32001,3-5.01001,4.47003-17.07001,14.84998-36.07001,27.52997-56.56,37.63-7.19,3.54999-14.56,6.77997-22.09998,9.66998-29.29004,11.23999-61.08002,17.40002-94.28003,17.40002-32.03998,0-62.76001-5.74005-91.19-16.24005-11.66998-4.29999-22.95001-9.40997-33.77997-15.25995-1.59003-.86005-3.17004-1.73004-4.74005-2.62006-8.25995-4.67999-16.25-9.78998-23.91998-15.31-5.72998-4.10999-11.28998-8.44-16.65997-13-1.88-1.58997-3.73999-3.19995-5.57001-4.84998-2.98004-2.65002-5.90002-5.38-8.75-8.17999-5.40002-5.28998-10.56-10.79999-15.48999-16.53003C26.09003,391.76996,2,331.64996,2,266,2,120.42999,120.42999,2,266,2s264,118.42999,264,264c0,66.65997-24.83002,127.62-65.72998,174.12Z"
              fill="#3f3d56"
            />
          </svg>
          <div>
            <p className="text-3xl font-semibold">{user.fullName}</p>
            <p className="text-gray-500 ">My Account</p>
          </div>
        </div>
        <hr />
        <p className="flex justify-center text-2xl font-semibold">
          {" "}
          Current Messages
        </p>
        {/* {conversationsArr.length==0} */}
        {conversationsArr.map((user, index) => {
          return (
            <>
              <div
                key={user.conversationId}
                className=" mt-9 flex justify-evenly items-center h-[12%]"
                onClick={() => {
                  handleMessages(user.conversationId, user);
                }}
              >
                <img
                  src={Img1}
                  alt="dp"
                  className="w-[60px] h-[60px] rounded-full border border-primary p-[2px]"
                />
                <div className="w-[50%]">
                  <p className="text-xl font-semibold">{user.user.fullName}</p>
                  <p className="text-gray-500">Available</p>
                </div>
              </div>
              <hr />
            </>
          );
        })}
      </div>
      <div className="w-[50%] border border-red-100">
        {load ? (
          <div className="w-full h-full flex justify-center items-center">
            <span className="font-bold">Select a conversation</span>
          </div>
        ) : messages?.messages?.length != 0 ||
          messages?.messages?.length == 0 ? (
          <div className="bg-white border border-black h-[10%] flex justify-around items-center">
            <div className="flex justify-start gap-5 ">
              <img
                src={Img1}
                alt="dp"
                className="w-[60px] h-[60px] rounded-full border border-primary p-[2px]"
              />
              <div>
                <p className="text-2xl font-semibold">
                  {receiverName?.user?.fullName}
                </p>
                <p className="text-gray-500">Online</p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-phone-outgoing"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="black"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              <line x1="15" y1="9" x2="20" y2="4" />
              <polyline points="16 4 20 4 20 8" />
            </svg>
          </div>
        ) : (
          ""
        )}
        {load ? (
          ""
        ) : (
          <div className="bg-white border border-black h-[80%] flex flex-col justify-start px-5 overflow-y-scroll pt-10">
            {messages?.messages?.length != 0 ? (
              messages?.messages?.map((message) => {
                return message.user.id == user.id ? (
                  <div className="w-[100%] flex justify-start items-start pb-3">
                    <p className="rounded-md font-semibold text-xl  bg-purple-300   text-wrap p-2">
                      {message.message}
                    </p>
                  </div>
                ) : (
                  <div className="w-[100%] flex justify-end items-end pb-3 ">
                    <p className="bg-slate-200 text-wrap rounded-md font-semibold text-xl p-2 ">
                      {message.message}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <span className="font-bold">Select a conversation</span>
              </div>
            )}
          </div>
        )}

        {load ? (
          ""
        ) : (
          <div className="bg-white border border-black h-[10%] flex justify-evenly items-center">
            <Input
              placeholder="Type a message..."
              className="w-[70%]"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
              onKeyDown={sendMessage}
            />
            <button onClick={sendMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-send"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-circle-plus"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="12" y1="9" x2="12" y2="15" />
            </svg>
          </div>
        )}
      </div>
      <div className="w-[25%] border border-red-100">
        {usersArr.map((userObj, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-evenly items-center h-[12%]"
                onClick={(e) => {
                  console.log(e.target.value);
                  handleMessages("new", userObj);
                }}
              >
                <img
                  src={Img1}
                  alt="dp"
                  className="w-[60px] h-[60px] rounded-full border border-primary "
                />
                <div className="w-[50%]">
                  <p className="text-xl font-semibold">
                    {userObj.user.fullName}
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
