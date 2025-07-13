import React from "react";
import { Button, Layout, Input } from "antd";
const { Content } = Layout;

function Learning({ lesson }) {
  // Hàm trích xuất video ID từ YouTube URL
  const getYouTubeEmbedUrl = (videoUrl) => {
    if (!videoUrl) return null;

    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = videoUrl.match(youtubeRegex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&enablejsapi=1`;
    }

    return null;
  };

  // Lấy video ID từ lesson
  let videoUrl = getYouTubeEmbedUrl(lesson.urlVideo);
  console.log("Video URL:", videoUrl);
  return (
    <>
      {/* Main content trái: có scroll riêng */}
      <Content className="flex-1 overflow-y-auto px-2 md:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Video + tiêu đề */}
          <div className="mb-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              {videoUrl && (
                <iframe
                  key={lesson.lessonId}
                  id="lessonVideo"
                  width="100%"
                  height="100%"
                  src={
                    videoUrl +
                    (videoUrl.includes("?") ? "&" : "?") +
                    "enablejsapi=1"
                  }
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{lesson.lessonName}</h2>
          </div>

          {/* Bình luận hỏi đáp */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Bình luận & Hỏi đáp</h3>
            <div className="flex gap-2 mt-4">
              <Input.TextArea
                placeholder="Nhập bình luận hoặc câu hỏi..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                className="flex-1"
              />
              <Button type="primary">Gửi</Button>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}

export default Learning;
