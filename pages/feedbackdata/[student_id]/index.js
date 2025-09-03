import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FeedbackData() {
  const router = useRouter();
  const [feedback_data, setFeedback_data] = useState([]);

  useEffect(() => {
    const { student_id } = router.query;

    async function fetchFeedbackResponse() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/feedbackResponse/${student_id}`
        );
        console.log("student response : ", response.data);
        setFeedback_data(response.data.student_feedbacks);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchFeedbackResponse();
  }, [router]);

  return (
    <motion.div
      className="w-[1000px] h-screen mx-auto mt-6 rounded-sm overflow-y-scroll flex flex-col gap-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {feedback_data.map((item, index) => (
        <motion.div
          key={item._id}
          className="bg-slate-900 w-[600px] flex flex-col justify-items-start gap-4 p-6 mx-auto"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-[70px] items-center">
              <Image
                src={`${item.teacher.image_url ? item.teacher.image_url : null}`}
                alt={"teacher profile"}
                width={75}
                height={75}
                unoptimized={true}
                className="w-[55px] h-[55px] object-cover rounded-full"
              />
              <h1 className="font-bold text-2xl">{item.teacher.name}</h1>
            </div>
            <button className="border-2 border-dotted border-green-500 text-green-500 px-4 py-2 rounded-lg">
              Successfully completed
            </button>
          </div>
          <div className="flex flex-row justify-between">
            <h1 className="font-bold text-xl">
              <span className="text-amber-500">createdAt</span> :{" "}
              {item.feedback_id.createdAt.split("T")[0]}
            </h1>
            <h1 className="font-bold text-xl">
              <span className="text-amber-500">expires</span> :{" "}
              {item.feedback_id.expiryDate.split("T")[0]}
            </h1>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
