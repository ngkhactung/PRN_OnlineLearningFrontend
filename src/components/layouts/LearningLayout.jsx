import React from "react";
import { Outlet } from "react-router-dom";
import { Button, Progress, Layout } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Header, Footer } = Layout;

function LearningLayout() {
  return (
    <Layout className="min-h-screen flex flex-col overflow-hidden">
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
      <Outlet/>

      
    </Layout>
  );
}

export default LearningLayout;
