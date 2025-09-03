import { useEffect, useState } from 'react';
import { useSemester } from "../context/SemesterContext";
import Sem from "../components/sem";  
import MediaCard from '../components/cards';
import axios from 'axios';
import { motion } from "framer-motion";
import { useUser, useAuth } from '@clerk/clerk-react';

export default function Home() {
  const { user } = useUser();
  const { selectedSemester } = useSemester();
  const [teachers, setTeachers] = useState([]);
  const [myMap, setMyMap] = useState(new Map());
  const [student_id, setStudent_id] = useState("");
  const [showInvalidUserPopup, setShowInvalidUserPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const {signOut} = useAuth();

  useEffect(() => {
    async function getUserId() {
      if (!user) return; // Ensure user is available

      try {
        setIsLoading(true);
        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) return console.error("User email not found");
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/${email}`);
        console.log(response)
        if(response.data.student.length === 0) {
          setShowInvalidUserPopup(true);
          setTimeout(() => {
            setShowInvalidUserPopup(false);
            signOut();
          }, 2000);
        } else {
          const fetchedStudentId = response.data.student[0]._id;
          setStudent_id(fetchedStudentId);
          setStudentName(response.data.student[0].name || user.firstName || "Student");
        }
      } catch (error) {
        console.error("Error fetching student ID:", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    getUserId();
  }, [user, signOut]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        if (selectedSemester.value !== undefined) {
          setIsLoading(true);
          setTeachers([]);
          setMyMap(new Map());

          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semester/${selectedSemester.value}`);
          const sem_id = response.data.semesters[0]._id;
          const data = response.data.semesters[0].teachers;
          setTeachers(data);

          if (response.data) {
            const response2 = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedback/${sem_id}`);
            const feedbackData = response2.data.feedback;
            const newMap = new Map();
            feedbackData.forEach(elem => {
              newMap.set(elem.teacher, elem._id);
            });

            setMyMap(newMap);
          }
        }
      } catch (error) {
        console.error("Error fetching semester data:", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeachers();
  }, [selectedSemester.value]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  // Current time greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Invalid User Popup */}
      {showInvalidUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div 
            className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border-2 border-red-500"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p className="text-white text-lg">
              Your email is not registered in our system. You will be signed out momentarily.
            </p>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section / Landing Page */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-indigo-500/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="text-indigo-400 font-medium">{getGreeting()},</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{studentName}</span>
                </h1>
                <p className="text-gray-300 text-lg mb-6">
                  Reach up to your mentors and provide pending feedbacks. Use AI for generating comments..
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Courses</h3>
                      <p className="text-gray-400 text-sm">View your course mentors.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Feedbacks</h3>
                      <p className="text-gray-400 text-sm">View pending Feedbacks</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Rate/Comment</h3>
                      <p className="text-gray-400 text-sm">Motivate your mentors a bit</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/3 flex justify-center">
              <motion.div 
                className="bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 p-6 rounded-2xl border border-white/10 shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Select Semester</h3>
                  <p className="text-gray-400 text-sm mb-4">Choose a semester to view your mentors</p>
                </div>
                <Sem />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        {selectedSemester.value ? (
          isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-l-4 border-purple-500 border-solid rounded-full absolute top-0 animate-spin-slow"></div>
              </div>
            </div>
          ) : (
            <>
              {teachers.length > 0 ? (
                <>
                  {/* Teachers header */}
                  <motion.div 
                    className="text-center py-8 mb-10 relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 rounded-2xl blur-xl -z-10"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Meet Your Mentors
                    </h2>
                    <p className="text-lg text-gray-300 mt-3 max-w-2xl mx-auto">
                      Discover the faculty members guiding you through Semester{" "}
                      <span className="text-indigo-400 font-semibold">{selectedSemester.value}</span>. Connect with them for guidance and support.
                    </p>
                    <div className="flex items-center justify-center mt-4">
                      <div className="h-1 w-10 bg-indigo-500 rounded-full"></div>
                      <div className="h-1 w-10 bg-purple-500 mx-2 rounded-full"></div>
                      <div className="h-1 w-10 bg-blue-500 rounded-full"></div>
                    </div>
                  </motion.div>

                  {/* Teachers grid */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {teachers.map((item) => (
                      <motion.div 
                        key={item.id}
                        variants={itemVariants}
                        className="h-full"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <MediaCard item={item} mymap={myMap} Student_id={student_id}/>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  className="text-center py-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-2">No teachers found</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    There are no teachers assigned to Semester {selectedSemester.value} yet. Please check back later.
                  </p>
                </motion.div>
              )}
            </>
          )
        ) : (
          <motion.div 
            className="text-center py-20 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-white mb-2">Select a Semester</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Choose a semester from the dropdown above to view your mentors and course information.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-800 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} University Academic Portal. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}