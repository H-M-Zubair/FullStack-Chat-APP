import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // State to store the selected image for the modal
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-200">
      <ChatHeader />

      {/* Chat Box Wrapper */}
      <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg flex-1">
        <div className="p-4 space-y-4 overflow-y-auto max-h-full">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === authUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
              ref={messageEndRef}
            >
              <div
                className={`
                  max-w-[80%] rounded-xl p-3 shadow-sm
                  ${
                    message.senderId === authUser._id
                      ? "bg-primary text-primary-content"
                      : "bg-base-200"
                  }
                `}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                    onClick={() => {
                      setSelectedImage(message.image);
                      document.getElementById("image_modal").showModal();
                    }}
                  />
                )}
                {message.text && <p className="text-sm">{message.text}</p>}
                <p
                  className={`
                    text-[10px] mt-1.5
                    ${
                      message.senderId === authUser._id
                        ? "text-primary-content/70"
                        : "text-base-content/70"
                    }
                  `}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MessageInput />

      {/* Modal for Image Preview */}
      <dialog id="image_modal" className="modal">
        <div className="modal-box relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full rounded-md"
            />
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ChatContainer;
