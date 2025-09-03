import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import FeedbackSlider from "../../../components/feedback_slider";

export default function FeedbackPage(){
const router = useRouter();
const {feedback_id} = router.query
const [feedback_details,setFeedbackDetails] = useState([]);
const [feedbackQuestions,setFeedbackQuestions] = useState([]);
useEffect(() => {
    async function fetchFeedbackDetails() {
        if (feedback_id) {  // Ensure feedback_id is available
            try {
                console.log("Fetching feedback for ID:", feedback_id);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/newfeedback/${feedback_id}`);
                console.log(response.data.feedback);
                setFeedbackDetails(response.data.feedback);
                setFeedbackQuestions(response.data.feedback[0].questions);
            } catch (error) {
                console.error("Error fetching feedback details:", error);
            }
        }

    }
    fetchFeedbackDetails();
}, [feedback_id]);  // Depend on feedback_id instead of router.query


 // use this id and axios and query all feedback questions from database...
    return(
        <>
        <div className="w-full h-screen bg-zinc-800 pt-[100px] flex flex-col gap-[50px] items-center">
            <div className="w-[1000px] h-auto mx-auto flex flex-row justify-between items-center">
                <div className="w-[350px] h-[100px] border-2 border-zinc-600 p-2 flex flex-row gap-[27px] justify-center items-center rounded-sm">
                        <Image
                        src={`${feedback_details[0] && feedback_details[0].teacher.image_url?feedback_details[0].teacher.image_url:null}`}
                        alt="teacher_profile"
                        width={75}
                        height={75}
                        unoptimized={true}
                        className="rounded-full w-[75px] h-[75px] object-cover"
                        />
                        <div className="flex flex-col justify-baseline gap-1">
                        <h3 className="text-emerald-600 font-bold text-2xl">{feedback_details[0]?feedback_details[0].teacher.name:""}</h3>
                        <h3 className="text-amber-200 font-mono"><span className="text-amber-600">posted on</span> : {feedback_details[0]?feedback_details[0].createdAt.split("T")[0]:""}</h3>
                        </div>
                        
                </div>
                <div className="w-[350px] h-[100px] border-2 border-zinc-600 flex justify-center items-center">
                    <h2 className="text-2xl font-bold text-emerald-600 ">Questions : <span className="font-bold text-blue-500">{feedbackQuestions?feedbackQuestions.length:""}</span></h2>
                </div>
            </div>
            <div className="w-[1000px] h-fit p-4">
               {feedbackQuestions.length>0 && <FeedbackSlider feedbackQuestions={feedbackQuestions} teacherId={feedback_details[0].teacher._id} studentId={"67cd59fbb930c316c160c3b2"} feedbackId={feedback_details[0]._id}/>}

            </div>

        </div>

        </>
    )

}