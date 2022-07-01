import React from "react";

function Submission({ submission }) {
  const date = new Date(submission.createdAt);
  return (
    <div className="container flex flex-col justify-center items-center bg-neutral-200 p-4 rounded-lg">
      <h3 className="text-xl">{submission.username}</h3>
      <h4 className="text-lg text-purple-800">
        <a href={submission.url} target="_blank">
          Link
        </a>
      </h4>
      <h4>Submision Date: {date.toLocaleDateString()}</h4>
      <h4>Submision Time: {date.toLocaleTimeString()}</h4>
    </div>
  );
}

export default Submission;
