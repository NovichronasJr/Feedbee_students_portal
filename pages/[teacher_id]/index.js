import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import AIChatBox from "../../components/chatbox";

export default function TeacherPage() {
  const { user } = useUser();
  const router = useRouter();
  const { teacher_id } = router.query;
  const [details, setDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [aihelp, setAihelp] = useState(false);

  async function fetchStudentId(email) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/${email}` //
      );
      if (response.data.student.length > 0) {
        setStudentId(response.data.student[0]._id);
      } else {
        console.error("No student found for email:", email);
      }
    } catch (error) {
      console.error("Error fetching student ID:", error);
    }
  }

  useEffect(() => {
    if (user) {
      let email = user.emailAddresses[0]?.emailAddress;
      fetchStudentId(email);
    }

    if (!teacher_id) return;

    const getTeacherDetails = async () => {
      if (!teacher_id) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teachers/${teacher_id}`
        );
    
        if (response.data?.teachers) {
          setDetails(response.data.teachers);
        } else {
          console.warn("No teacher data received.");
          setDetails([]);
        }
    
        // Fetch comments only if teacher data exists
        try {
          const response2 = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/${teacher_id}`
          );
          setComments(response2.data?.comments || []);
        } catch (err) {
          console.error("Error fetching comments:", err.response?.data || err.message);
        }
      } catch (error) {
        console.error(
          "Error fetching teacher details:",
          error.response?.data || error.message
        );
    
        setDetails([]);
      }
    };

    getTeacherDetails();
  }, [teacher_id, user]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    if (!studentId) {
      console.error("Student ID is missing, fetching again...");
      let email = user.emailAddresses[0]?.emailAddress;
      await fetchStudentId(email);
      if (!studentId) {
        console.error("Student ID is still undefined after fetching!");
        return;
      }
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/newComment`, {
        teacher_id,
        student_id: studentId,
        comment: newComment,
      });
      console.log(response);
      setComments([...comments, { comment: newComment }]);
      setNewComment("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error submitting comment:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Top Header Section */}
        <div className="mb-8">
          <nav className="flex justify-between items-center mb-10">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Back to Teachers
            </button>
            <div className="text-sm text-gray-400">
              {user && (
                <span>Logged in as {user.emailAddresses[0]?.emailAddress}</span>
              )}
            </div>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Teacher Profile */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 h-32 relative">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  {details && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg bg-gray-700">
                      <Image
                        src={details[0]?.image_url || "/default-avatar.png"}
                        alt={details[0]?.name || "Teacher"}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  {details ? details[0]?.name : "Loading..."}
                </h1>
                <div className="h-1 w-16 bg-blue-500 mx-auto my-4 rounded-full"></div>

                <div className="flex justify-center space-x-4 mb-6">
                  <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm text-blue-300 flex flex-row gap-4">
                    {details && details[0]?.qualifications?.length > 0 ? (
                      details[0].qualifications.map((item, index) => (
                        <h2 key={index} className="text-amber-600">
                          {item}
                        </h2>
                      ))
                    ) : (
                      <h2 className="text-amber-600">Subject Expert</h2>
                    )}
                  </div>

                  <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm text-emerald-300">
                    5+ Years
                  </div>
                </div>

                <div className="mt-6 text-left">
                  <h2 className="text-lg font-medium text-blue-300 mb-2">
                    About
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {details ? details[0]?.about : "Loading details..."}
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h2 className="text-lg font-medium text-blue-300 mb-4">
                      Contact
                    </h2>
                    <div className="flex items-center text-sm mb-3">
                      <svg
                        className="w-4 h-4 mr-3 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span className="text-gray-300">
                        contact@university.edu
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-3 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                      <span className="text-gray-300">
                        Office Hours: Mon-Fri 9AM-4PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Comments Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mb-8">
              <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-amber-400">
                    Student Feedback
                  </h2>
                  <span className="bg-gray-700 text-xs font-medium text-gray-300 px-3 py-1.5 rounded-full">
                    {comments.length}{" "}
                    {comments.length === 1 ? "comment" : "comments"}
                  </span>
                </div>

                <div className="h-[calc(100vh-300px)] min-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div
                        key={index}
                        className="mb-4 bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-500 transform transition-all duration-200 hover:scale-[1.01] hover:shadow-blue-900/20 hover:shadow-md"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">A</span>
                          </div>
                          <div>
                            <h3 className="text-gray-200 font-semibold">
                              Anonymous Student
                            </h3>
                            <span className="text-xs text-gray-500">
                              Verified Student
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 ml-10 mt-1">
                          {comment.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                      <svg
                        className="w-12 h-12 mb-3 opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        ></path>
                      </svg>
                      <p>
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 flex flex-wrap gap-3 justify-between">
                <button
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center shadow-lg shadow-blue-900/20"
                  onClick={() => setIsModalOpen(true)}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Add Feedback
                </button>

                <button
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center shadow-lg shadow-emerald-900/20"
                  onClick={() => setAihelp(!aihelp)}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                  {aihelp ? "Close AI Help" : "Get AI Help"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Help Box - Redesigned as a floating window */}
      {aihelp && (
        <div className="fixed right-8 bottom-8 w-80 md:w-96 z-50 rounded-xl overflow-hidden shadow-2xl shadow-blue-900/30 border border-blue-900/50 bg-gray-800 transition-all duration-300 ease-in-out">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-4 py-3 flex justify-between items-center border-b border-blue-800 cursor-move">
            <h3 className="font-medium text-blue-100 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              AI Assistant
            </h3>
            <div className="flex space-x-2">
              <button className="text-blue-200 hover:text-white">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 12H6"
                  ></path>
                </svg>
              </button>
              <button
                onClick={() => setAihelp(false)}
                className="text-blue-200 hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="p-2 h-96 overflow-hidden">
            <AIChatBox student_id={studentId} teacher_id={teacher_id} />
          </div>
          <div className="bg-gray-900 px-3 py-2 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
            <span>Powered by AI</span>
            <span>v1.0.2</span>
          </div>
        </div>
      )}

      {/* Redesigned Comment Modal with a more professional look */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/70 backdrop-blur-sm transition-opacity"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-700">
              <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 px-4 py-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3
                    className="text-xl leading-6 font-bold text-blue-400"
                    id="modal-title"
                  >
                    Share Your Feedback
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-4 pt-5 pb-4 sm:p-6">
                <div className="space-y-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-blue-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="text-sm text-gray-300">
                        <p>
                          Your feedback helps other students make informed
                          decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <textarea
                      className="w-full h-40 bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="What do you think about this teacher? Be honest and constructive..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-400">
                        Your feedback will be posted anonymously.
                      </p>
                      <span className="text-xs text-gray-500">
                        {newComment.length} characters
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-700">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmitComment}
                >
                  Submit Feedback
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}
