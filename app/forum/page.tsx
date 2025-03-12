"use client";
import { ArrowBigUpDash, ThumbsUp, ThumbsUpIcon } from "lucide-react";
import React, { useState } from "react";
import Signout from "@/components/signout";

const dummyData = [
  {
    id: 1,
    question: "What's your favorite Holi tradition?",
    name: "Rahul Sharma",
    totalVotes: 42,
    hasUpvoted: true,
  },
  {
    id: 2,
    question: "Best color combinations for Holi celebration",
    name: "Priya Patel",
    totalVotes: 28,
    hasUpvoted: false,
  },
  {
    id: 3,
    question: "How do you protect your skin during Holi?",
    name: "Amit Kumar",
    totalVotes: 35,
    hasUpvoted: true,
  },
  {
    id: 4,
    question: "Favorite Holi sweets and snacks?",
    name: "Neha Gupta",
    totalVotes: 19,
    hasUpvoted: false,
  },
  {
    id: 5,
    question: "Tips for eco-friendly Holi celebrations?",
    name: "Vikram Singh",
    totalVotes: 51,
    hasUpvoted: true,
  },
];

const page = () => {
  const [openModal, setOpenModal] = useState(false);
  const toggleVote = () => {};

  return (
    <div className="w-screen   h-screen flex items-center justify-center overflow-x-hidden">
      <div className="navBar  fixed w-full bg-background h-20 inset-0 flex items-center justify-between p-4">
        <div className="title text-3xl text-primary">Water u Hiding ?</div>
        <div
          onClick={() => {
            setOpenModal(!openModal);
          }}
          className="askButton bg-primary text-2xl  rounded-full text-white w-14 h-14 flex items-center justify-center hover:bg-primary-dark hover:cursor-pointer focus:bg-primary-dark"
        >
          <div className="text-xl">Ask </div>
        </div>
      </div>
      {dummyData.length != 0 ? (
        <div className="questionsContainer mt-48 px-6  h-full  flex flex-col items-center justify-start gap-4">
          {dummyData.map((question) => {
            return (
              <div
                className="w-full p-4 bg-background-alt rounded-lg "
                key={question.id}
              >
                <div className="main text-xl">{question.question}</div>
                <div className="bottom w-full pt-2 flex items-center justify-between">
                  <div className="left text-neutral-600 text-md">
                    {question.name}
                  </div>
                  <div className="right flex items-center justify-center gap-4 text-md">
                    <div className="upvotes text-neutral-600  pb-0">
                      +{question.totalVotes}
                    </div>
                    <div
                      className={`vote pb-1  ${
                        question.hasUpvoted === true
                          ? "text-primary-dark "
                          : "text-white"
                      }`}
                      onClick={toggleVote}
                    >
                      <ThumbsUp size={25} className="" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-screen w-full text-5xl text-primary text-center py-40 ">
          Ask the first question.
        </div>
      )}

      {/* <div className="questionModal "></div> */}
      {openModal == true ? <Modal setOpenModal={setOpenModal} /> : <></>}
    </div>
  );
};

const Modal = ({
  setOpenModal,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  };
  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 flex items-center justify-center bg-[#1e1e1e]/70 "
    >
      <div className="bg-background-alt p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl ">Ask your Question - 1/2</h2>

          <button
            onClick={() => {
              setOpenModal(false);
            }}
            className="text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            className="w-full p-3 bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          ></textarea>

          <div className="attention my-4">
            <h3>Disclaimer :</h3>
            <ul className="text-md    " style={{ listStyleType: "disc" }}>
              <li className="my-2">
                Avoid questions that target individuals or groups in a harmful
                or discriminatory way.
              </li>
              <li className="my-2">
                Questions should be respectful and in good spirit.
              </li>
              <li className="my-2">
                Any offensive, defamatory, or inappropriate question will be
                removed by moderators.
              </li>
            </ul>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition hover:cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default page;
