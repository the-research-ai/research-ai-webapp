import React, { useEffect, useState } from "react";
import "./LatestPapers.css";
import { useNavigate } from "react-router-dom";
import mixpanel from "mixpanel-browser";

const LatestPapers = () => {
  const [latestPapers, setLatestPapers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestPapers();
  }, []);

  const fetchLatestPapers = async () => {
    const fetchedPapers = [
      {
        title:
          "Retrieval-Augmented Generation for AI-Generated Content: A Survey",
        id: "2402.19473v6",
        published: "06/21/2024",
        url: "https://arxiv.org/abs/2402.19473",
      },
      {
        title: "Scalable MatMul-free Language Modeling",
        id: "2406.02528v5",
        published: "06/18/2024",
        url: "https://arxiv.org/abs/2406.02528",
      },
      {
        title: "KAN: Kolmogorov-Arnold Networks",
        id: "2404.19756v4",
        published: "06/16/2024",
        url: "https://arxiv.org/abs/2404.19756",
      },
      {
        title: "MambaOut: Do We Really Need Mamba for Vision?",
        id: "2405.07992v3",
        published: "05/20/2024",
        url: "https://arxiv.org/abs/2405.07992",
      },
      {
        title: "MoRA: High-Rank Updating for Parameter-Efficient Fine-Tuning",
        id: "2405.12130v1",
        published: "05/20/2024",
        url: "https://arxiv.org/abs/2405.12130",
      },
      {
        title:
          "How Far Are We to GPT-4V? Closing the Gap to Commercial Multimodal Models with Open-Source Suites",
        id: "2404.16821v2",
        published: "04/29/2024",
        url: "https://arxiv.org/abs/2404.16821",
      },
    ];
    setLatestPapers(fetchedPapers);
  };

  const openLatestPaper = (id, paperTitle, paperPublishedDate, pdfUrl) => {
    // mixpanel.track_links("#paper-result", "Clicked to Open Paper");
    mixpanel.track("Clicked to Open Latest Paper");

    navigate(`/paper/${id}`, {
      state: { paperTitle, paperPublishedDate, pdfUrl, referrer: "dashboard" },
    });
  };

  return (
    <div className="latest-papers-container">
      <div className="headline">Latest papers</div>
      <div className="latest-papers">
        {latestPapers.map((paper) => (
          <div
            key={paper.id}
            className="paper"
            onClick={() =>
              openLatestPaper(paper.id, paper.title, paper.published, paper.url)
            }
          >
            <div>{paper.title}</div>
            <div className="paper-published">
              Published on - {paper.published}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestPapers;
