import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GetComments() {
  const [commentdata, setcommentdata] = useState([]);
  const router = useRouter();
  const { student_id } = router.query;

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/getcomment/${student_id}`
        );
        console.log("comment response : ", response.data);
        setcommentdata(response.data.comments);
      } catch (error) {
        console.log(error.message);
      }
    }
    if (student_id) fetchComments();
  }, [student_id]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto py-6 space-y-6"
    >
      {commentdata.map((item, index) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="w-full bg-gray-900 shadow-md rounded-lg flex items-center gap-6 p-6 transition hover:scale-105 hover:shadow-lg h-40"
        >
          <div className="flex flex-col items-center gap-2">
            <Image
              src={item.teacher_id.image_url || null}
              alt="teacher profile"
              width={55}
              height={55}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-500"
              unoptimized={true}
            />
            <h1 className="font-bold text-white text-lg">{item.teacher_id.name}</h1>
          </div>
          <div className="flex flex-col items-start flex-1 text-white h-full overflow-y-scroll p-2 bg-gray-800 rounded-lg">
            <motion.div 
              className="overflow-y-scroll h-full w-full p-2"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="font-semibold text-lg">{item.comment}</h2>
            </motion.div>
            <h2 className="font-medium text-sm text-gray-400 mt-2">
              <span className="text-amber-600">Posted on:</span> {item.createdAt.split("T")[0]}
            </h2>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
