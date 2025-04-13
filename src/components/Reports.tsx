"use client";
import {
  CircleAlert,
  CircleCheck,
  File,
  MoreVertical,
  Trash2,
  User2,
} from "lucide-react";
import React from "react";
import { useUser } from "./AuthComponent";
import Stats from "./Stats";

const Reports = () => {
  const { user } = useUser();
  return (
    <div>
      {/* <section className="mb-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tighter">
          {user?.name}
        </h1>
        <p className="mb-4">
          {`I am passionate about applying new age technology to solving real life problems, with an analytical approach and creative mind, always working on building my skills to perform better and make a difference.`}
        </p>
        <p className="mb-4">
          {`Lead of Project Cell Crce 24-25 | Crescendo'24 Winner | Hackanova 3.0 2nd Runner Up | Tech Vista Algozenith Winner | Start-a-thon, IIT Madras Top 4 | CRCE'26`}
        </p>
      </section> */}
      <Stats />

      <section className="mb-8">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <h1 className="mb-6 text-2xl font-semibold tracking-tighter">
              My Focus Points
            </h1>
            <div className="mb-6">
              {
                // weakness.map((weakness, index) => (
                <div
                  key={0}
                  className="rounded-md border border-red-500/50 px-4 py-3 text-red-600"
                >
                  <p className="text-sm">
                    <CircleAlert
                      className="me-3 -mt-0.5 inline-flex opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    {/* {weakness} */}Hi
                  </p>
                </div>
                // ))
              }
            </div>
          </div>
          <div>
            <h1 className="mb-6 text-2xl font-semibold tracking-tighter">
              My Strength Points
            </h1>
            <div className="mb-6">
              {
                // strength.map((strength, index) => (
                <div
                  key={0}
                  className="rounded-md border border-green-500/50 px-4 py-3 text-green-600"
                >
                  <p className="text-sm">
                    <CircleCheck
                      className="me-3 -mt-0.5 inline-flex opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    {/* {strength} */} hello
                  </p>
                </div>
                // ))
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
