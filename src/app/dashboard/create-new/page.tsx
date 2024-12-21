"use client";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { useVideoDataContext } from "@/app/_context/VideoDataContext";
import { db } from "@/config/db";
import { Users, VideoData } from "@/config/schema";
import { videoParams } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { formDataProps, VideoScriptItem } from "@/types/types";
import PlayerDialog from "../_components/PlayerDialog";
import { useUserDetailContext } from "@/app/_context/UserDetailContext";
import { toast } from "sonner";
import { eq } from "drizzle-orm";

const CreateNew = () => {
  const [formData, setFormData] = useState<formDataProps>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [videoScript, setVideoScript] = useState<
    VideoScriptItem[] | undefined
  >();
  const [audioFileUrl, setAudioFileUrl] = useState<string | undefined>();
  const [captions, setCaptions] = useState<string | undefined>();
  const [playVideo, setPlayVideo] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<number>(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { userDetail, setUserDetail } = useUserDetailContext();
  const { videoData, setVideoData } = useVideoDataContext();
  const { user } = useUser();

  const handleInputChange = (fieldName: string, fieldValue: string) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const createClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Button clicked, starting getVideoScript...");
    if ((userDetail?.credits ?? 0) < 10) {
      toast("You don't have enough Credits");
      return;
    }
    GetVideoScript();
    // GenerateAudioFile(scriptData)
    // GenerateAudioCaption(fileUrl)
    // GenerateImage()
  };

  const GetVideoScript = async () => {
    setLoading(true);
    const prompt =
      "Write a script to generate " +
      formData.duration +
      " video on topic : " +
      formData.topic +
      " along with AI image prompt in " +
      formData.imageStyle +
      " format for each scene and give me result in JSON format with imagePrompt and ContextText as field, No Plain text";
    try {
      const response = await fetch("/api/get-video-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setVideoData((prev) => ({
        ...prev,
        script: data.result,
      }));
      setVideoScript(data.result);
      await GenerateAudioFile(data.result);
    } catch (e) {
      console.error("Failed to fetch video script:", e);
    } finally {
      setLoading(false);
    }
  };

  // Generate audio file and save to firebase storage
  const GenerateAudioFile = async (
    videoScriptData: VideoScriptItem[] | undefined
  ) => {
    setLoading(true);
    let script = "";
    const id = uuidv4();
    videoScriptData?.forEach((item: VideoScriptItem) => {
      script = script + item.contextText + " ";
    });
    // console.log(script);
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ text: script, id: id }),
      });
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the raw error response
        console.error("Error generating audio file:", errorMessage);
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setVideoData((prev) => ({
        ...prev,
        audioFileUrl: data.result,
      }));
      setAudioFileUrl(data.result);
      if (data.result) {
        await GenerateAudioCaption(data.result, videoScriptData);
      }
    } catch (e) {
      console.error("Error generate audio file:", e);
    } finally {
      setLoading(false);
    }
  };

  // Used to generate caption from audio file
  const GenerateAudioCaption = async (
    fileUrl: string,
    videoScriptData: VideoScriptItem[] | undefined
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioFile: fileUrl }),
      });
      const data = await response.json();
      setVideoData((prev) => ({
        ...prev,
        captions: data.result,
      }));
      setCaptions(data.result);
      if (data.result) {
        await GenerateImage(videoScriptData);
      }
    } catch (e) {
      console.error("Error generate audio caption:", e);
    } finally {
      setLoading(false);
    }
  };

  // Used to Generate AI Images
  const GenerateImage = async (
    videoScriptData: VideoScriptItem[] | undefined
  ) => {
    setLoading(true);
    try {
      const imageFiles: string[] = [];

      for (const item of videoScriptData || []) {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompts: item.imagePrompt }),
        });
        const data = await response.json();
        imageFiles.push(data.result);
      }
      setVideoData((prev) => ({
        ...prev,
        imageList: imageFiles,
      }));
      setImageList(imageFiles);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const UpdateUserCredits = useCallback(async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const result = await db
        .update(Users)
        .set({
          credits: (userDetail?.credits ?? 0) - 10,
        })
        .where(eq(Users?.email, user.primaryEmailAddress.emailAddress));
      console.log(result);
    }
    setUserDetail((prev) => ({
      ...prev,
      credits: (userDetail?.credits ?? 0) - 10,
    }));

    setVideoData(null);
  }, [
    user?.primaryEmailAddress?.emailAddress,
    userDetail?.credits,
    setUserDetail,
    setVideoData,
  ]);

  const SaveVideoData = useCallback(
    async (videoData: videoParams | videoParams[]) => {
      setLoading(true);
      console.log(videoData);

      // Ensure videoData is an array
      const videos = Array.isArray(videoData) ? [videoData[0]] : [videoData];
      console.log(videos[0]);

      try {
        const flattenedImageList: string[] = Array.isArray(videos[0]?.imageList)
          ? videos[0]?.imageList.flat() // Flatten nested arrays
          : [];

        const result = await db
          .insert(VideoData)
          .values({
            script: videos[0]?.script || [],
            audioFileUrl: videos[0]?.audioFileUrl || "",
            captions: videos[0]?.captions || [],
            imageList: flattenedImageList,
            createdBy: user?.primaryEmailAddress?.emailAddress || "",
          })
          .returning({ id: VideoData?.id });

        console.log("Inserted result:", result);
        setSubmitted(true);
        await UpdateUserCredits();
        setVideoId(result[0].id);
        setPlayVideo(true);
      } catch (error) {
        console.error("Error inserting videos:", error);
      } finally {
        setLoading(false);
      }
    },
    [user, UpdateUserCredits]
  );

  useEffect(() => {
    if (videoData && Object.keys(videoData).length === 4 && !submitted) {
      SaveVideoData(videoData);
    }
  }, [videoData, submitted, SaveVideoData]);

  useEffect(() => {
    if (videoData) {
      console.log(videoScript, audioFileUrl, captions, imageList);
    }
  }, [videoData]);

  return (
    <div className="lg:px-10">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>
      <div className="mt-10 shadow-md p-10 lg:px-6">
        <SelectTopic onUserSelect={handleInputChange} />
        <SelectStyle onUserSelect={handleInputChange} />
        <SelectDuration onUserSelect={handleInputChange} />

        <Button onClick={createClickHandler} className="mt-10 w-full">
          Create Short Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  );
};

export default CreateNew;
