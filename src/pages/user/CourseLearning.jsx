import React from "react";
import { Button, Layout, Menu, Avatar, Input, List } from "antd";
const { Content, Sider } = Layout;
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);
const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  backgroundColor: "#fff",
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

function CourseLearning() {
  return (
    <Layout hasSider>
      {/* Main content trái */}
      <Content className="flex-1 px-2 md:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Video + tiêu đề */}
          <div className="mb-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/8ud31ymkNT0?si=4jZb7gfQST2qyDr4"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <h2 className="text-2xl font-bold mb-2">LessonName</h2>
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
      {/* Sidebar phải */}
      <Sider>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items2}
          style={siderStyle}
        />
      </Sider>
    </Layout>
  );
}

export default CourseLearning;
