import axios, { CancelTokenSource } from "axios";
import { motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const API_URL = "https://quizly-api.onrender.com";

type IAPIResponse = {
  countryCode: string;
  phoneNumber: string;
  _id: string;
};

function PlayAgain() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("61");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelSource = useRef<CancelTokenSource>();

  const formattedPhoneNumber = useMemo(() => {
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
        3,
        6
      )} ${phoneNumber.slice(6)}`;
    }
  }, [phoneNumber]);

  const handleSubmit = useCallback(async () => {
    try {
      if (isSubmitting) {
        return;
      }

      if (cancelSource.current) {
        cancelSource.current.cancel();
      }

      cancelSource.current = axios.CancelToken.source();

      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/subscribe`,
        {
          countryCode,
          phoneNumber,
        },
        {
          cancelToken: cancelSource.current.token,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Thank you for subscribing!");
      }
    } catch (error: any) {
      console.error(error);

      if (error.response && error.response.status === 400) {
        toast.error("Subscriber already exists");
      } else {
        toast.error("An error occurred while processing your request.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, countryCode, phoneNumber]);
  return (
    <>
      <div className="w-[88%] max-w-[1800px] mx-auto border-t border-gray-300 mb-2"></div>

      <motion.div
        className="w-[95%] max-w-[1800px] mx-auto h-[calc(100%-7%-9px)]"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col flex-1 justify-between h-full">
          <div className="flex flex-col items-center h-[49%]">
            <h1 className="text-lg  xl:text-xl text-center mt-2 lg:mt-6 mb-6 font-semibold play-again-title">
              Take Another Quiz
            </h1>

            <p className="max-w-md text-center font-semibold mb-6 play-again-subtitle">
              Enter your phone number to receive a link via SMS to our bonus
              quiz
            </p>

            <div className="flex play-again-input">
              <div className="relative inline-flex">
                <PhoneInput
                  country={"au"}
                  value={countryCode}
                  onChange={setCountryCode}
                  inputClass="w-32 p-2.5 rounded-l-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                  inputProps={{
                    id: "phone",
                    name: "phone",
                    placeholder: "+61 2 1234 5678",
                  }}
                  inputStyle={{
                    display: "none",
                  }}
                  buttonStyle={{
                    borderColor: "black",
                    borderWidth: 2,
                    borderRadius: 8,
                    outline: "none",
                    paddingLeft: 7,
                    paddingRight: 7,
                    height: 52,
                  }}
                />
              </div>
              <input
                type="text"
                name="phoneNumber"
                id="phone"
                className="w-[230px] md:w-[300px] p-2.5 rounded-lg border-2 border-black focus:ring-primary-600 focus:border-primary-600 ml-16 h-[52px] "
                value={`+${countryCode} ${formattedPhoneNumber}`}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value.startsWith(`+${countryCode}`)) {
                    const newValue = value
                      .slice(countryCode.length + 1)
                      .replace(/\D/g, "");
                    setPhoneNumber((prev) =>
                      newValue.length <= 10 ? newValue : prev
                    );
                  } else {
                    setPhoneNumber(value);
                  }
                }}
                placeholder="Phone Number"
              />
            </div>

            <button
              aria-roledescription="Subscribe"
              className="play-again-button flex place-items-center justify-center mx-auto border-2 border-black bg-[#D0FFDD] mt-7 mb-4 lg:mb-7 rounded-lg py-3 w-[250px] transition duration-500 lg:py-3 lg:text-lg"
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className=" w-6 aspect-square text-black animate-spin mr-3"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Subscribing
                </>
              ) : (
                "Subscribe"
              )}
            </button>

            <p className="max-w-md text-center play-again-note">
              We’ll send you a message each day when a new quiz is live
            </p>
          </div>

          <div className="subscribe-img">
            <img src="/message-img.svg" className="h-full w-auto mx-auto" />
          </div>
        </div>
      </motion.div>
    </>
  );
}

function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
  } else {
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
      3,
      6
    )} ${phoneNumber.slice(6, 10)}`;
  }
}

export default PlayAgain;
