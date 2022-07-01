import Head from "next/head";
import { useState, useEffect } from "react";
import Submission from "../components/Submission";

export default function Home() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("All Weeks");
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    generateWeekBoundries();
    fetchSubmissions();
  }, []);
  useEffect(() => {
    const filteredSubmissions = submissions.filter((submission) => {
      if (selectedWeek === "All Weeks") {
        return false;
      } else {
        const from = weeks.find((week) => week.name === selectedWeek).start;
        const date = new Date(submission.createdAt);
        const to = weeks.find((week) => week.name === selectedWeek).end;

        return from <= date && to >= date;
      }
    });
    setFilteredSubmissions(filteredSubmissions);
  }, [selectedWeek]);
  const fetchSubmissions = async () => {
    const data = await fetch("/api/discord");
    const json = await data.json();
    setSubmissions(await json);
  };
  const generateWeekBoundries = () => {
    const array = [];
    let index = 2;
    const firstWeek = {
      name: `Week 1`,
      start: new Date(Date.parse("07/23/2021 13:01:00")),
      end: new Date(Date.parse("07/30/2021 13:00:59")),
    };

    let newWeek;
    const today = new Date();
    do {
      newWeek = {
        name: `Week ${index}`,
        start: new Date(firstWeek.start.setDate(firstWeek.start.getDate() + 7)),
        end: new Date(firstWeek.end.setDate(firstWeek.end.getDate() + 7)),
      };

      array.push(newWeek);
      index++;
    } while (newWeek.end.valueOf() < today.valueOf());

    setWeeks([
      {
        name: `Week 1`,
        start: new Date(Date.parse("07/23/2021 13:01:00")),
        end: new Date(Date.parse("07/30/2021 13:00:59")),
      },
      ...array,
    ]);
  };
  return (
    <div className="container min-w-full flex flex-col justify-start items-center min-h-screen bg-neutral-900">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-6xl text-neutral-100 p-10">Play of the Week</h1>
      <select
        name="week-select"
        onChange={(e) => setSelectedWeek(e.target.value)}
      >
        <option value="All Weeks">All Weeks</option>
        {weeks.reverse().map((week, key) => {
          return (
            <option value={week.name} key={key}>
              {week.name}: {week.start.toLocaleDateString()}-
              {week.end.toLocaleDateString()}
            </option>
          );
        })}
      </select>
      {submissions && (
        <div className="container min-w-full grid grid-cols-3 justify-center items-center gap-4 p-10">
          {selectedWeek === "All Weeks"
            ? submissions
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt);
                  const dateB = new Date(b.createdAt);
                  return dateA.valueOf() - dateB.valueOf();
                })
                .map((submission) => {
                  return (
                    <Submission submission={submission} key={submission.id} />
                  );
                })
            : filteredSubmissions
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt);
                  const dateB = new Date(b.createdAt);
                  return dateA.valueOf() - dateB.valueOf();
                })
                .map((submission) => {
                  return (
                    <Submission submission={submission} key={submission.id} />
                  );
                })}
        </div>
      )}
    </div>
  );
}
