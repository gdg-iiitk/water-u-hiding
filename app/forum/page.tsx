"use client";
import { useAuth } from "@/context/authprovider";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import {
  ArrowBigUp,
  ArrowBigUpDash,
  ThumbsUp,
  ThumbsUpIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import Loader from "@/components/Loader";
import { Filter } from "bad-words";
import { clear } from "console";
import FollowLine from "@/components/FollowLine";
import toast from "react-hot-toast";

const questionsAsked = 1;

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
  {
    id: 6,
    question: "What are your favorite Holi songs?",
    name: "Anjali Verma",
    totalVotes: 23,
    hasUpvoted: false,
  },
  {
    id: 7,
    question: "How do you celebrate Holi with family?",
    name: "Rohit Mehta",
    totalVotes: 37,
    hasUpvoted: true,
  },
  {
    id: 8,
    question: "Best places to celebrate Holi in India?",
    name: "Sneha Roy",
    totalVotes: 45,
    hasUpvoted: false,
  },
  {
    id: 9,
    question: "What are some unique Holi traditions?",
    name: "Karan Singh",
    totalVotes: 29,
    hasUpvoted: true,
  },
  {
    id: 10,
    question: "How do you make natural colors for Holi?",
    name: "Pooja Desai",
    totalVotes: 33,
    hasUpvoted: false,
  },
  {
    id: 11,
    question: "What are your favorite Holi memories?",
    name: "Arjun Kapoor",
    totalVotes: 40,
    hasUpvoted: true,
  },
  {
    id: 12,
    question: "How do you clean up after Holi?",
    name: "Meera Nair",
    totalVotes: 22,
    hasUpvoted: false,
  },
  {
    id: 13,
    question: "What are some fun Holi games?",
    name: "Vikas Joshi",
    totalVotes: 27,
    hasUpvoted: true,
  },
  {
    id: 14,
    question: "How do you prepare for Holi?",
    name: "Ritu Sharma",
    totalVotes: 31,
    hasUpvoted: false,
  },
  {
    id: 15,
    question: "What are the best Holi party ideas?",
    name: "Aakash Gupta",
    totalVotes: 36,
    hasUpvoted: true,
  },
];

const page = () => {
  const { user, setUser } = useAuth();
  if (user != null) {
    return (
      <div className="h-screen w-full text-5xl text-primary text-center flex items-center justify-center py-40 px-4 leading-relaxed">
        {/* Don't try to play the fool with me Nigesh , sign in first. */}
        <Loader />
      </div>
    );
  }
  const [openModal, setOpenModal] = useState(false);
  const [vote, setVote] = useState({});
  const [pendingVote, setPendingVote] = useState({});
  const [voteCounts, setVoteCounts] = useState(
    () => Object.fromEntries(dummyData.map((q) => [q.id, q.totalVotes])) // Initial vote counts
  );

  const setBatchUpdate = useCallback(
    debounce(async (updates) => {
      try {
        // updates.map((id) => {
        //   if (pendingVote[id] == vote[id]) {
        //     delete updates[id];
        //   }
        // });
        //

        console.log("Updating these votes ", updates);
        setPendingVote({});
      } catch (error) {
        console.error(error);
        setVoteCounts((prev) => {
          const revertedState = { ...prev };
          Object.keys(updates).forEach((id) => {
            revertedState[id] += updates[id] ? -1 : 1; // Undo vote change
          });
          return revertedState;
        });
      }
    }, 2000),
    []
  );

  const toggleVote = (id) => {
    console.log("started Toggle Vote");
    setVote((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      return newState;
    });

    setVoteCounts((prev) => {
      const newCounts = { ...prev, [id]: prev[id] + (vote[id] ? -1 : 1) };
      return newCounts;
    });
    setPendingVote((prev) => {
      const newPendingVote = { ...prev, [id]: !vote[id] };
      setBatchUpdate(newPendingVote);
      return newPendingVote;
    });
  };

  const isOldDevice = () => {
    const ua = window.navigator.userAgent;
    return /Android [1-9]|iPhone OS [1-12]/.test(ua); // Adjust as needed
  };

  useEffect(() => {
    setVote(
      dummyData.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr.hasUpvoted }),
        {}
      )
    );
    setVoteCounts(() =>
      Object.fromEntries(dummyData.map((q) => [q.id, q.totalVotes]))
    );
  }, [dummyData]);

  return (
    <div className="w-screen   h-screen flex items-center justify-center overflow-x-hidden">
      <div className="navBar  fixed z-40  w-full bg-background border border-background-alt h-20 inset-0 flex items-center justify-between p-4">
        <div className="title text-3xl text-primary">Water u Hiding ?</div>
        <div
          onClick={() => {
            if (questionsAsked < 2) {
              setOpenModal(!openModal);
            } else {
              toast.error("You have already asked 2 questions");
            }
          }}
          className="askButton bg-primary text-2xl  rounded-full text-white w-14 h-14 flex items-center justify-center hover:bg-primary-dark hover:cursor-pointer focus:bg-primary-dark"
        >
          <div className="text-xl">Ask </div>
        </div>
      </div>
      <FollowLine />

      {dummyData.length != 0 ? (
        <div className="questionsContainer mt-48 px-6  h-full  flex flex-col items-center justify-start gap-4 ">
          {dummyData.map((question) => {
            return (
              <div
                // initial={{ opacity: 0, y: 5 }}
                // // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.1 }}
                // whileInView={{ opacity: 1, y: 0 }}
                className="relative w-full p-4 bg-background-alt rounded-lg  "
                key={question.id}
              >
                <div className="main text-xl">{question.question}</div>
                <div className="bottom w-full pt-2 flex items-center justify-between">
                  <div className="left text-neutral-600 text-md">
                    {question.name}
                  </div>
                  <div className="right flex items-center justify-center gap-4 text-md">
                    <div className="upvotes text-neutral-600  pb-0 ">
                      +{voteCounts[question.id]}
                    </div>
                    {/* <AnimatedNumber value={voteCounts[question.id]} /> */}
                    <motion.div
                      whileTap={{ scale: 0.8, y: 5 }}
                      animate={{}}
                      transition={{
                        duration: 0.1,
                      }}
                      className={`vote pb-1 hover:cursor-pointer ${
                        vote[question.id] === true
                          ? "text-primary-dark "
                          : "text-white"
                      }`}
                      onClick={() => {
                        toggleVote(question.id);
                      }}
                    >
                      <ThumbsUp
                        size={25}
                        className={` ${
                          vote[question.id] === true ? "fill-current " : " "
                        }`}
                      />
                      {/* <ArrowBigUpDash /> */}
                    </motion.div>
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
      <FollowLine />

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
  const filter = new Filter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (question.length === 0) {
      return;
    }
    const questionData = question.trim();
    const cleanQuestion = filter.clean(questionData);
    if (cleanQuestion != questionData) {
      toast.error("Question contains inappropriate words");
      console.log("Question contains inappropriate words");
      return;
    }
    console.log(cleanQuestion);
    // send data to the server
  };
  return (
    <div
      id="modal-backdrop"
      className="fixed z-50 inset-0 flex items-center justify-center bg-[#1e1e1e]/70 "
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background-alt p-6 rounded-lg shadow-xl w-full max-w-lg "
      >
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
      </motion.div>
    </div>
  );
};

export default page;
