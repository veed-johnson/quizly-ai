import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PlayAgain() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("61");

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
            <h1 className="text-lg  xl:text-xl text-center mt-2 lg:mt-6 mb-6 font-semibold">
              Take Another Quiz
            </h1>

            <p className="max-w-md text-center font-semibold mb-6">
              Enter your phone number to receive a link via SMS to our bonus
              quiz
            </p>

            <div className="flex">
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
              className="flex place-items-center mx-auto border-2 border-black bg-[#D0FFDD] mt-7 mb-4 lg:mb-7 rounded-lg py-3 px-16 transition duration-500 hover:scale-105 lg:px-20 lg:py-3 lg:text-lg"
            >
              Subscribe
            </button>

            <p className="max-w-md text-center">
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
