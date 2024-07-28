"use client"

import { useEffect, useState } from "react";
import { UserProps } from "../types/userProps";

export default function useFetchUsers() {
  const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/", { next: { revalidate: 0 } });
        if (!res.ok) {
          throw new Error("Network response was not ok" + res.statusText);
        }
        const users = await res.json();
        setUsers(users);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchUsers();
  }, []);

  return users;
}
