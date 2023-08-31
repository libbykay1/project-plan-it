import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";

function Card({ project }) {
  return (
    <div className="card bg-white w-[200px] h-[350px] m-2 rounded-lg shadow-lg">
      <div className="top">
        <img
          className="w-[200px] h-[200px] object-cover  p-2"
          src={
            project?.project_picture ||
            "https://live.staticflickr.com/65535/53156011725_dd6c54efab_w.jpg"
          }
          alt={project?.project_name || "Project Name Cannot Be Found"}
        />
      </div>
      <div className="bottom flex flex-col justify-center items-start p-3">
        <div className="title font-semibold text-xs my-1">
          {project?.project_name || "Default Name"}
        </div>
        <div className="category text-xs font-light my-1">
          {project?.goal || "No Project Goal Found"}
        </div>
      </div>
    </div>
  );
}

Card.defaultProps = {
  project: {
    project_picture:
      "https://live.staticflickr.com/65535/53156011725_dd6c54efab_w.jpg",
    project_name: "Project Name Cannot Be Found",
    goal: "No Project Goal Found",
  },
};

function Carousel({ projects }) {
  const scrollLeft = () => {
    document.getElementById("content").scrollLeft -= 400;
  };
  const scrollRight = () => {
    document.getElementById("content").scrollLeft += 400;
  };

  return (
    <div className="relative">
      <div className="text-center py-4  text-xl font-bold">Carousel</div>
      <div className="absolute right-0 top-5 ">
        <button onClick={scrollLeft} className="p-2 m-2 rounded-full bg-white">
          <FiChevronLeft />
        </button>
        <button onClick={scrollRight} className="p-2 m-2 rounded-full bg-white">
          <FiChevronRight />
        </button>
      </div>
      <div
        id="content"
        className="carousel p-4 flex items-center justify-start overflow-x-auto scroll-smooth  scrollbar-hide"
      >
        {projects.map((project) => (
          <div key={project.id}>
            <Card project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Projectcards() {
  const { token } = useAuthContext();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const projectsUrl = "http://localhost:8000/api/projects";
  const fetchConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(projectsUrl, fetchConfig);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        setProjects(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Project information could not be populated");
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <Carousel projects={projects} />;
}

export default Projectcards;
export { Card, Carousel };
