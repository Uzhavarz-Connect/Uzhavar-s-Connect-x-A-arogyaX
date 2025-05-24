import Chats from "@/components/Chats";

const ChatPage = () => {
  // Dynamically get from auth
  const doctorUid = 1; // should be number, as your backend expects number
  const patientUid = 2;
  const currRole = "doctor"; // or "doctor"
  const currUserId = doctorUid;
  const otherUserId = patientUid;

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <h1 className="text-xl font-bold text-center p-4">Doctor-Patient Chat</h1>
      <div className="flex-1 overflow-auto">
        <Chats
          currUserId={currUserId}
          otherUserId={otherUserId}
          currRole={currRole}
        />
      </div>
    </div>
  );
};

export default ChatPage;
