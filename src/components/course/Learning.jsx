import React, { useEffect, useRef } from "react";
import { Button, Layout, Input } from "antd";
const { Content } = Layout;

function Learning({ lesson, onLessonCompleted }) {
  const playerRef = useRef(null);
  const iframeRef = useRef(null);

  // Hàm trích xuất video ID từ YouTube URL
  const getYouTubeEmbedUrl = (videoUrl) => {
    if (!videoUrl) return null;
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = videoUrl.match(youtubeRegex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  // Lấy video ID từ lesson
  const videoId = getYouTubeEmbedUrl(lesson.urlVideo);

  // Load YouTube IFrame API nếu chưa có
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // Khởi tạo player khi videoId hoặc lesson thay đổi
  useEffect(() => {
    if (!videoId) return;
    let player;
    function onYouTubeIframeAPIReady() {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      player = new window.YT.Player(`lessonVideo-${lesson.lessonId}`, {
        videoId: videoId,
        events: {
          onStateChange: (event) => {
            // 0: ended
            if (event.data === window.YT.PlayerState.ENDED) {
              if (typeof onLessonCompleted === "function") {
                onLessonCompleted(lesson.lessonId);
              }
            }
          },
        },
        playerVars: {
          rel: 0,
          enablejsapi: 1,
        },
      });
      playerRef.current = player;
    }
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [videoId, lesson.lessonId]);

  return (
    <>
      {/* Main content trái: có scroll riêng */}
      <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Video + tiêu đề */}
          <div className="mb-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              <div style={{ width: "100%", height: "100%" }}>
                <div
                  id={`lessonVideo-${lesson.lessonId}`}
                  ref={iframeRef}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{lesson.lessonName}</h2>
          </div>
          {/* Bình luận hỏi đáp */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Bình luận & Hỏi đáp</h3>
            <div className="flex gap-2 mt-4">
              <Input.TextArea
                placeholder="Nhập bình luận hoặc câu hỏi..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                className="flex-1"
              />
              <Button type="primary">Gửi</Button>
            </div>
          </div> */}
        </div>
      </Content>
    </>
  );
}

export default Learning;
