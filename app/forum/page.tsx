"use client";
import {useAuth} from "@/context/authprovider";

import {motion, useMotionValue, useTransform, animate} from "motion/react";
import {
    ArrowBigUp,
    ArrowBigUpDash,
    ThumbsUp,
    ThumbsUpIcon,
} from "lucide-react";
import React, {useCallback, useEffect, useState} from "react";
import {debounce} from "lodash";
import Loader from "@/components/Loader";
import {Filter} from "bad-words";
import {clear} from "console";
import FollowLine from "@/components/FollowLine";
import toast from "react-hot-toast";

interface Question {
    id: string;
    hasUpvoted: boolean;
    name: string;
    question: string;
    totalVotes: number;
}

const page = () => {

    const [openModal, setOpenModal] = useState(false);
    const [vote, setVote] = useState<any>({});
    const [pendingVote, setPendingVote] = useState({});
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionsAsked, setQuestionsAsked] = useState<number>(0);
    const [initalFetch, setInitalFetch] = useState<boolean>(true);
    const [voteCounts, setVoteCounts] = useState(
        () => Object.fromEntries(questions.map((q) => [q.id, q.totalVotes])) // Initial vote counts
    );
    const {user} = useAuth();
    const setBatchUpdate = useCallback(
        debounce(async (updates) => {
            try {
                // updates.map((id) => {
                //   if (pendingVote[id] == vote[id]) {
                //     delete updates[id];
                //   }
                // });
                //
                doUpvote(updates);
                setPendingVote({});
            } catch (error) {
                console.error(error);
                setVoteCounts((prev) => {
                    const revertedState = {...prev};
                    Object.keys(updates).forEach((id) => {
                        revertedState[id] += updates[id] ? -1 : 1; // Undo vote change
                    });
                    return revertedState;
                });
            }
        }, 2000),
        []
    );
    const doUpvote = async (updates: any) => {
        console.log(user);
        let token = await user?.getIdToken();
        if (!token) {
            token = localStorage.getItem("token") ?? "";
        }
        const res = await fetch("/api/upvote", {
            method: "POST",
            body: JSON.stringify({votes: updates}),
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Updating these votes ", updates);
    }
    const fetchData = async () => {
        const token = await user?.getIdToken();
        try {
            const res = await fetch("/api/getQuestions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                const data = await res.json();
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setInitalFetch(false);
        }
        try {
            const res = await fetch("/api/noOfQuestionsAsked", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                const data = await res.json();
                setQuestionsAsked(data.number);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        setVote(
            questions.reduce(
                (acc, curr) => ({...acc, [curr.id]: curr.hasUpvoted}),
                {}
            )
        );
        setVoteCounts(() =>
            Object.fromEntries(questions.map((q) => [q.id, q.totalVotes]))
        );
    }, [questions]);
    useEffect(() => {
        fetchData().then(() => {
        });
    }, [user]);
    if (user == null) {
        return (
            <div
                className="h-screen w-full text-5xl text-primary text-center flex items-center justify-center py-40 px-4 leading-relaxed">
                {/* Don't try to play the fool with me Nigesh , sign in first. */}
                <Loader/>
            </div>
        );
    }

    const toggleVote = (id: string) => {
        console.log("started Toggle Vote");
        setVote((prev: any) => {
            const newState = {...prev, [id]: !prev[id]};
            return newState;
        });

        setVoteCounts((prev) => {
            const newCounts = {...prev, [id]: prev[id] + (vote[id] ? -1 : 1)};
            return newCounts;
        });
        setPendingVote((prev) => {
            const newPendingVote = {...prev, [id]: !vote[id]};
            setBatchUpdate(newPendingVote);
            return newPendingVote;
        });
    };

    const isOldDevice = () => {
        const ua = window.navigator.userAgent;
        return /Android [1-9]|iPhone OS [1-12]/.test(ua); // Adjust as needed
    };


    return (
        <>
            <div className="w-screen   h-screen flex items-center justify-center overflow-x-hidden">
                <div
                    className="navBar  fixed z-40  w-full bg-background border border-background-alt h-20 inset-0 flex items-center justify-between p-4">
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
                        <div className="text-xl">Ask</div>
                    </div>
                </div>
                <FollowLine/>

                {questions.length != 0 && !initalFetch ? (
                    <div
                        className="questionsContainer mt-48 px-6  h-full  flex flex-col items-center justify-start gap-4 ">
                        {questions.map((question) => {
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
                                                whileTap={{scale: 0.8, y: 5}}
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
                                                    toggleVote(String(question.id));
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
                <FollowLine/>
                {/* <div className="questionModal "></div> */}
                {openModal == true ? <Modal setOpenModal={setOpenModal} setQuestions={setQuestions}
                                            questionsAsked={questionsAsked} setAskedQuestion={setQuestionsAsked} /> : <></>}
            </div>
        </>
    );
};

const Modal = ({
                   setOpenModal, setQuestions, questionsAsked, setAskedQuestion,
               }: {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>,
    questionsAsked: number
    setAskedQuestion: React.Dispatch<React.SetStateAction<number>>,

}) => {
    const [question, setQuestion] = useState("");
    const {user} = useAuth();
    const filter = new Filter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const token = await user?.getIdToken();
        setOpenModal(false);
        const res = await fetch("/api/createQuestion", {
            method: "POST",
            body: JSON.stringify({question: questionData}),
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (res.status === 200) {
            toast.success("Question Added...");
            const data = await res.json();
            setQuestions((old_questions) => [
                ...old_questions,
                {
                    id: data.doc?.qid,
                    hasUpvoted: false,
                    name: data.doc?.displayName,
                    question: data.doc?.text,
                    totalVotes: data.doc?.upvotes
                }
            ]);
            setAskedQuestion(current => current + 1);
        }
        console.log(cleanQuestion);
    };
    return (
        <div
            id="modal-backdrop"
            className="fixed z-50 inset-0 flex items-center justify-center bg-[#1e1e1e]/70 "
        >
            <motion.div
                initial={{scale: 0.7, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                className="bg-background-alt p-6 rounded-lg shadow-xl w-full max-w-lg "
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl ">Ask your Question - {questionsAsked}/2</h2>

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
                        <ul className="text-md    " style={{listStyleType: "disc"}}>
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
