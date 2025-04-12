"use client";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CircleCheck, Loader2, User2 } from "lucide-react";
import { useUser } from "./AuthComponent";
import { enrollStudent } from "~/app/api/manageEnrolledin";

export const JoinClass = ({ classId }: { classId: string }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const enroll = async () => {
        if (user?.id && classId) {
          console.log("Enrolling user:", user.id, "in class:", classId);
          await enrollStudent({
            classId,
            studentId: user.id,
          });
        }
      };

      enroll();
    }, [classId, user]);

  return (
    <div>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-3xl flex-col gap-6">
          <div className="border-eborder rounded-md border px-4 py-3">
            {isLoading ? (
              <p className="text-sm">
                <Loader2
                  className="me-3 animate-spin -mt-0.5 inline-flex text-emerald-500"
                  size={20}
                  aria-hidden="true"
                />
                Give us a minute we are enrolling {user?.name} into {classId}{" "}
                class
              </p>
            ) : (
              <p className="text-sm">
                <CircleCheck
                  className="me-3 -mt-0.5 inline-flex text-emerald-500"
                  size={20}
                  aria-hidden="true"
                />
                Joined Classroom successfully! Your will be redirected to your
                classroom
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
