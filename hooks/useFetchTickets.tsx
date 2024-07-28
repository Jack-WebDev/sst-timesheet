"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { HelpDesk } from "@/types/helpDeskProps";

export default function useFetchTickets() {
  const [tickets, setTickets] = useState<HelpDesk[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await axios.get<HelpDesk[]>("/api/helpdesk");
      const tickets = res.data;
      setTickets(tickets);
    };

    fetchTickets();
  }, []);

  return tickets;
}
