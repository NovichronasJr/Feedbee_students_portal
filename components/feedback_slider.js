import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/router"; // Changed to Next.js router

export default function FeedbackSlider({ feedbackQuestions, studentId, feedbackId, teacherId }) {
  const router = useRouter(); // Using Next.js router
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleSelectOption = (questionId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const nextQuestion = () => {
    if (selectedOptions[feedbackQuestions[currentIndex]._id] && currentIndex < feedbackQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const submitResponses = async () => {
    try {
      setIsSubmitting(true);
      const responseData = {
        student_id: studentId,
        feedback_id: feedbackId,
        teacher: teacherId,
        responses: feedbackQuestions.map(question => ({
          questionId: question._id,
          selectedOption: selectedOptions[question._id]
        }))
      };

      const response = await axios.post('${process.env.process.env.process.env.process.env.process.env.process.env.process.env.process.env.process.env.process.env.process.env.NEXT_PUBLIC_BACKEND_URL}/add-response', { responseData });
      console.log('Response submitted successfully:', response.data);
      
      setSubmissionStatus('success');
      setMessage('Feedback submitted successfully!');
      setTimeout(() => {
        router.back(); // Changed to Next.js router's back navigation
      }, 2000);
    } catch (error) {
      console.error('Error submitting response:', error);
      setSubmissionStatus('error');
      setMessage(error.response?.data?.message || 'An error occurred while submitting feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = feedbackQuestions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-8 shadow-lg rounded-xl bg-white border border-gray-100 min-h-[400px] relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
          <div className="text-white text-xl font-semibold">Submitting...</div>
        </div>
      )}

      {/* Success/Error Modal */}
      <AnimatePresence>
        {submissionStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className={`p-6 rounded-xl ${submissionStatus === 'success' ? 'bg-green-100' : 'bg-red-100'} max-w-md`}>
              <div className={`text-lg font-semibold mb-4 ${submissionStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {message}
              </div>
              <button
                onClick={() => {
                  setSubmissionStatus(null);
                  if (submissionStatus === 'success') router.back();
                }}
                className={`w-full py-2 rounded-lg ${submissionStatus === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} hover:opacity-90`}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Section */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-semibold text-gray-800 text-center">
              {currentQuestion.text}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(currentQuestion._id, option)}
                  className={`p-4 text-lg font-medium rounded-lg border transition-all duration-200 ${
                    selectedOptions[currentQuestion._id] === option
                      ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                  disabled={isSubmitting}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0 || isSubmitting}
          className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${
            currentIndex > 0
              ? "text-gray-600 hover:bg-gray-50 hover:text-gray-700"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={currentIndex === feedbackQuestions.length - 1 ? submitResponses : nextQuestion}
          disabled={!selectedOptions[currentQuestion._id] || isSubmitting}
          className={`px-8 py-2.5 font-medium rounded-lg transition-colors ${
            selectedOptions[currentQuestion._id]
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : currentIndex === feedbackQuestions.length - 1 ? (
            'Submit'
          ) : (
            'Next →'
          )}
        </button>
      </div>
    </div>
  );
}