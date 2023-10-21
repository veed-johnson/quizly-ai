import Image from "next/image";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

interface Props {
  shareUrl: string;
  content: string;
}
function ShareEmojis({ shareUrl, content }: Props) {
  return (
    <div className="flex justify-center mt-5">
      <FacebookShareButton url={shareUrl} quote={content}>
        <button
          role="share to facebook"
          className="w-11 h-11 xl:w-14 xl:h-14 rounded-full border-black border-2 bg-[#B0FFFF] grid place-items-center mx-2 transition duration-300 hover:scale-110"
        >
          <img
            src={"/facebook-share.svg"}
            alt="share to facebook"
            className="w-[60%] h-auto"
          />
        </button>
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={content}>
        <button
          role="share to twitter"
          className="w-11 h-11 xl:w-14 xl:h-14 rounded-full border-black border-2 bg-[#EDEDED] grid place-items-center mx-2 2xl:mx-4 transition duration-300 hover:scale-110"
        >
          <img
            src={"/twitter-share.svg"}
            alt="share to twitter"
            className="w-[60%] h-auto"
          />
        </button>
      </TwitterShareButton>

      <WhatsappShareButton url={shareUrl} title={content}>
        <button
          role="share to whatsApp"
          className="w-11 h-11 xl:w-14 xl:h-14 rounded-full border-black border-2 bg-[#CCFFCE] grid place-items-center mx-2 transition duration-300 hover:scale-110"
        >
          <img
            src={"/whatsapp-share.svg"}
            alt="share to whatsapp"
            className="w-[60%] h-auto"
          />
        </button>
      </WhatsappShareButton>
    </div>
  );
}

export default ShareEmojis;
