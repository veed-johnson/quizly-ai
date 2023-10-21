"use client";

import { useModalStore } from "@/store/modal-store";
import { Dialog } from "@headlessui/react";
import classNames from "classnames";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useMemo } from "react";

export default function Modal() {
  const { open, hideModal, content } = useModalStore();

  const sizeClassName = useMemo(
    () => ({
      "max-w-[500px] mx-auto": content?.mode === "custom",
    }),
    [content?.mode]
  );

  return (
    <div>
      <MotionConfig
        transition={{ type: "spring", bounce: 0.3, duration: open ? 0.7 : 0.4 }}
      >
        <AnimatePresence initial={false}>
          {open && (
            <Dialog
              as={motion.div}
              initial="closed"
              animate="open"
              exit="closed"
              static
              className="relative z-10"
              open={open}
              onClose={() => {
                content?.onPress();
                hideModal();
              }}
            >
              <motion.div
                variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                className="fixed inset-0 bg-black bg-opacity-60"
              />

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                  className={classNames(
                    "flex min-h-full justify-center p-4 text-center items-center sm:p-0",
                    sizeClassName
                  )}
                >
                  <Dialog.Panel
                    as={motion.div}
                    variants={{
                      closed: {
                        opacity: "var(--opacity-from)",
                        scale: "var(--scale-from, 1)",
                        y: "var(--y-from, 0px)",
                      },
                      open: {
                        opacity: "var(--opacity-to)",
                        scale: "var(--scale-to, 1)",
                        y: "var(--y-to, 0px)",
                      },
                    }}
                    className="relative overflow-hidden border-black border-[6px] bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-2xl sm:p-6
                      max-sm:[--y-from:16px] sm:[--scale-from:80%] [--opacity-from:0%]
                      max-sm:[--y-to:0px] sm:[--scale-to:100%] [--opacity-to:100%]
                    "
                  >
                    {content?.mode === "custom" ? (
                      <div className="max-w-sm mx-auto text-center">
                        {content.image && (
                          <img
                            src={content.image}
                            alt={content.title}
                            className="w-14 h-auto mx-auto mb-5"
                          />
                        )}

                        <div>
                          {content.title && (
                            <Dialog.Title
                              as="h2"
                              className="text-[40px] font-bold leading-[1.2em] text-gray-900"
                            >
                              {content.title}
                            </Dialog.Title>
                          )}
                        </div>

                        <p className="md:text-lg 2xl:text-xl">
                          {content.message}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="max-w-md mx-auto">
                          <div
                            className={classNames(
                              "mx-auto w-[88px] aspect-square flex items-center justify-center rounded-full",
                              content?.mode === "correct"
                                ? "bg-[#CBFFDA]"
                                : "bg-[#FF9696]"
                            )}
                          >
                            <Image
                              src={`/${
                                content?.mode === "correct"
                                  ? "trophy.svg"
                                  : "caution.svg"
                              }`}
                              alt={"correct icon"}
                              className={"w-[60%] h-auto"}
                              width={100}
                              height={100}
                              priority
                            />
                          </div>
                          <div className="mt-3 text-center">
                            <Dialog.Title
                              as="h2"
                              className="text-[40px] font-bold leading-[1.2em] text-gray-900"
                            >
                              {content?.mode === "correct"
                                ? "Correct!"
                                : "Wrong!"}
                            </Dialog.Title>
                            <hr className="w-60 h-[1px] mx-auto my-2 bg-black border-0 rounded md:my-2 "></hr>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                {content?.message}
                              </p>
                              <p className="font-semibold mt-3">
                                {Math.round(Math.random() * 25 + 60)}% of People
                                got this{" "}
                                {content?.mode === "correct"
                                  ? "right"
                                  : "wrong"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 flex justify-center">
                          <button
                            type="button"
                            className="inline-flex w-auto justify-between items-center rounded-md  border-black border-2 px-3 py-2 text-sm font-semibold text-black shadow-sm  sm:ml-3"
                            onClick={() => {
                              content?.onPress();
                              hideModal();
                            }}
                          >
                            <p className="mr-3 text-lg font-semibold">
                              {content?.buttonText || "Next Question"}
                            </p>
                            <Image
                              src="/arrow-right.svg"
                              alt={"next question"}
                              className={"h-auto"}
                              width={20}
                              height={20}
                              priority
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
}
