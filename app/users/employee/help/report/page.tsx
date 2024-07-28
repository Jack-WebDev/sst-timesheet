"use client";
import { useThemeStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { HelpDesk } from "@/types/helpDeskProps";
import { processHelpDeskData } from "@/utils/helpDeskData";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const HelpDeskReport: React.FC = () => {
  const [data, setHelpDesks] = useState<HelpDesk[]>([]);
  const [filter, setFilter] = useState("All");
  const [filteredData, setFilteredData] = useState(data);
  const [processedData, setProcessedData] = useState(processHelpDeskData(data));
  const [showPDF, setShowPDF] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const filterData = (data: HelpDesk[], filter: string) => {
      const now = new Date();
      let filteredData = data;

      switch (filter) {
        case "Daily":
          filteredData = data.filter((d) => {
            const date = new Date(d.date || "");
            return date.toDateString() === now.toDateString();
          });
          break;
        case "Weekly":
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          filteredData = data.filter((d) => {
            const date = new Date(d.date || "");
            return date >= oneWeekAgo && date <= now;
          });
          break;
        case "Bi-Weekly":
          const twoWeeksAgo = new Date(now);
          twoWeeksAgo.setDate(now.getDate() - 14);
          filteredData = data.filter((d) => {
            const date = new Date(d.date || "");
            return date >= twoWeeksAgo && date <= now;
          });
          break;
        case "monthly":
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          filteredData = data.filter((d) => {
            const date = new Date(d.date || "");
            return date >= oneMonthAgo && date <= now;
          });
          break;
        case "6months":
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          filteredData = data.filter((d) => {
            const date = new Date(d.date || "");
            return date >= sixMonthsAgo && date <= now;
          });
          break;
        case "All":
          filteredData = data;
          break;
        default:
          break;
      }

      return filteredData;
    };

    const newFilteredData = filterData(data, filter);
    setFilteredData(newFilteredData);
    setProcessedData(processHelpDeskData(newFilteredData));
  }, [filter, data]);

  useEffect(() => {
    const fetchHelpDesks = async () => {
      try {
        const res = await axios.get<HelpDesk[]>("/api/helpdesk/report");
        const helpDesks = res.data;
        setHelpDesks(helpDesks);
      } catch (error) {
        console.error("Failed to fetch help desks", error);
      }
    };

    fetchHelpDesks();
  }, []);

  const handleClosePDF = () => {
    setShowPDF(false);
  };

  const handleGeneratePDF = () => {
    setShowPDF(true);
  };

  const GeneratePDF = ({ onClose, filterOption }: any) => {
    const styles = StyleSheet.create({
      viewer: {
        width: "100%",
        height: "100%",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
      page: {
        flexDirection: "column",
        padding: 10,
        backgroundColor: "#f5f5f5",
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
      },
      heading: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
      },
      table: {
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderRightWidth: 0,
        borderBottomWidth: 0,
      },
      tableRow: {
        flexDirection: "row",
        marginBottom: 8,
      },
      tableCol: {
        width: "11%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        borderLeftWidth: 0,
        borderTopWidth: 0,
      },
      tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10,
        textAlign: "center",
      },
    });

    const renderTable = () => (
      <View style={{ display: "flex", flexDirection: "column", padding: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "2000rem",
            borderBottom: "1 solid black",
          }}
        >
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Date
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Call Duration
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Campus
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Query
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Resolve
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Client
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Problem
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Status
          </Text>
          <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
            Call Agent
          </Text>
        </View>
        {filteredData
          ?.sort((a, b) => {
            const dateA = Date.parse(a.date || "0");
            const dateB = Date.parse(b.date || "0");
            return dateB - dateA;
          })
          .map((helpDesk) => (
            <View
              key={helpDesk.id}
              style={{
                display: "flex",
                width: "2000rem",
                flexDirection: "row",
                borderBottom: "1 solid black",
              }}
            >
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.date}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.callDuration}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.campus}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.query}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.resolve}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.client}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.problem}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.status}
              </Text>
              <Text style={{ width: "10%", padding: 5, textAlign: "center" }}>
                {helpDesk.callAgent}
              </Text>
            </View>
          ))}
      </View>
    );

    return (
      <div className="absolute z-10 top-[20%] left-[25%] right-[5%] bottom-0">
        <div className="w-full bg-gray-800 text-white py-4 pl-4 flex justify-between items-center rounded-t-xl">
          <Button
            variant="default"
            onClick={onClose}
            className="text-lg font-semibold w-1/5 h-[5vh] bg-red-600 hover:bg-red-700"
          >
            Close PDF
          </Button>
          <h3 className="text-lg font-semibold pr-4">HelpDesk Report</h3>
        </div>
        <PDFViewer style={styles.viewer}>
          <Document style={{ borderRadius: 10 }}>
            <Page size={{ width: 2000, height: 1000 }} style={styles.page}>
              <View>
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    textAlign: "center",
                    marginBottom: 40,
                    marginTop: 20,
                    color: "#dda83a",
                  }}
                >
                  {filterOption} HelpDesk Report
                </Text>
                {renderTable()}
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    );
  };
  return (
    <>
      <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-8 text-primary text-center">
          HelpDesk Report
        </h2>
        <div className="my-8">
          <h3 className="text-2xl font-medium text-center text-secondary mb-4">
            Overview
          </h3>
          <div className="flex flex-col gap-y-4 text-lg">
            <p>
              Shortest Call Duration:{" "}
              <span className="font-bold text-gray-700">
                {processedData.shortestCall}
              </span>
            </p>
            <p>
              Longest Call Duration:{" "}
              <span className="font-bold text-gray-700">
                {processedData.longestCall}
              </span>
            </p>
            <p>
              Average Time Spent on Call:{" "}
              <span className="font-bold text-gray-700">
                {processedData.averageTimeSpent}
              </span>
            </p>
            <p>
              Resolved Tickets Percentage:{" "}
              <span className="font-bold text-gray-700">
                {processedData.resolvedPercentage}%
              </span>
            </p>
            <p>
              Freshdesk Tickets Percentage:{" "}
              <span className="font-bold text-gray-700">
                {processedData.freshdeskPercentage}%
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full my-4">
          <h3 className="text-2xl font-semibold text-secondary">
            All HelpDesk Data
          </h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="text-lg">
              Filter by:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-lg text-black bg-gray-200 border border-primary rounded-xl py-1 px-2"
            >
              <option value="All">All</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="6months">6 Months</option>
            </select>
            <Button onClick={handleGeneratePDF} className="text-xl py-4 px-4">Generate Report</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-primary text-white text-lg font-medium border-t-2 border-gray-400">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Call Duration</th>
                <th className="py-3 px-4 text-left">Campus</th>
                <th className="py-3 px-4 text-left">Query</th>
                <th className="py-3 px-4 text-left">Resolve</th>
                <th className="py-3 px-4 text-left">Client</th>
                <th className="py-3 px-4 text-left">Problem</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Call Agent</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                ?.sort((a, b) => {
                  const dateA = new Date(a.date ?? 0);
                  const dateB = new Date(b.date ?? 0);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((helpDesk) => (
                  <tr
                    key={helpDesk.id}
                    className="border-b border-gray-400 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">{helpDesk.date}</td>
                    <td className="py-3 px-4">{helpDesk.callDuration}</td>
                    <td className="py-3 px-4">{helpDesk.campus}</td>
                    <td className="py-3 px-4">{helpDesk.query}</td>
                    <td className="py-3 px-4">{helpDesk.resolve}</td>
                    <td className="py-3 px-4">{helpDesk.client}</td>
                    <td className="py-3 px-4">{helpDesk.problem}</td>
                    <td className="py-3 px-4">{helpDesk.status}</td>
                    <td className="py-3 px-4">{helpDesk.callAgent}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPDF && (
        <GeneratePDF onClose={handleClosePDF} filterOption={filter} />
      )}
    </>
  );
};

export default HelpDeskReport;
