"use client";
import React, { useEffect, useState } from "react";

const FollowLine = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / totalHeight) * 100;
      setHeight(progress);
    };

    window.addEventListener("scroll", updateHeight);
    return () => window.removeEventListener("scroll", updateHeight);
  }, []);

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "5px",
        backgroundColor: "black",
        zIndex: 9999,
      }}
      className="z-50 fixed"
    >
      <div
        style={{
          width: `${height}%`,
          height: "100%",
          backgroundColor: "red",
        }}
      />
    </div>
  );
};

export default FollowLine;
