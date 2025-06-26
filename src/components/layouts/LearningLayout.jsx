import React from "react";
import { Outlet } from "react-router-dom";
import { Button, Progress, Layout } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Header, Footer } = Layout;

function LearningLayout() {
  return (
    <Layout className="min-h-screen flex flex-col">
      {/* Header cố định */}
      <div className="flex items-center justify-between px-6 sticky top-0 z-20 h-20 bg-cyan-900">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            href="/"
            style={{ color: "#fff" }}
            className="text-lg"
          ></Button>
          <span className="text-xl font-bold ml-4 text-white">
            Khoá học: Lập trình cơ bản
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Progress
            type="circle"
            width={50}
            strokeColor="#1677ff"
            format={(p) => <span style={{ color: "white" }}>{p}%</span>}
          />

          <span className="font-semibold text-white">Tiến độ: 2/10 bài</span>
        </div>
      </div>
      <Outlet />

      {/* Footer cố định */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-100 shadow flex justify-center gap-4 py-4 z-30 mt-10">
        <Button>Bài trước đó</Button>
        <Button type="primary">Bài tiếp theo</Button>
      </div>
    </Layout>
  );
}

export default LearningLayout;
