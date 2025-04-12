"use server";
import { db } from "~/server/db";
import { type User } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getUser(email: string) {
  const user: User | null = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

export async function createUser({
  name,
  email,
  isTeacher,
  password,
}: {
  name: string;
  email: string;
  isTeacher: boolean;
  password: string;
}) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user: User = await db.user.create({
    data: {
      name: name,
      email: email,
      isTeacher: isTeacher,
      password: hash,
    },
  });

  return user;
}
