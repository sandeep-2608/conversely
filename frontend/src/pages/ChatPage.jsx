import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // This will only run if authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: authUser.profilePic,
          },
          tokenData.token,
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat: ", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  // useEffect(() => {
  //   // 1. If data isn't ready, stay in "loading" but don't try to connect yet
  //   if (!tokenData?.token || !authUser?._id || !targetUserId) return;

  //   const client = StreamChat.getInstance(STREAM_API_KEY);
  //   let isMounted = true;

  //   const initChat = async () => {
  //     try {
  //       // 2. Prevent redundant connection attempts
  //       if (client.userID !== authUser._id) {
  //         await client.connectUser(
  //           {
  //             id: authUser._id,
  //             name: authUser.name,
  //             image: authUser.profilePic,
  //           },
  //           tokenData.token,
  //         );
  //       }

  //       // 3. FIX: Ensure ID is under 64 chars by using a hash or shorter prefix if needed
  //       // For now, let's log it to check length
  //       const channelId = [authUser._id, targetUserId].sort().join("-");

  //       if (channelId.length > 64) {
  //         console.error("Channel ID too long:", channelId.length);
  //         toast.error("Channel ID exceeds limit.");
  //         setLoading(false);
  //         return;
  //       }

  //       const currChannel = client.channel("messaging", channelId, {
  //         members: [authUser._id, targetUserId],
  //       });

  //       await currChannel.watch();

  //       if (isMounted) {
  //         setChatClient(client);
  //         setChannel(currChannel);
  //       }
  //     } catch (error) {
  //       console.error("Stream initialization error:", error);
  //       toast.error("Failed to connect to chat.");
  //     } finally {
  //       if (isMounted) setLoading(false);
  //     }
  //   };

  //   initChat();

  //   return () => {
  //     isMounted = false;
  //     // Only disconnect if the component is actually unmounting,
  //     // not just re-running due to strict mode
  //     client.disconnectUser();
  //   };
  // }, [tokenData?.token, authUser?._id, targetUserId]); // Use specific IDs as dependencies

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
