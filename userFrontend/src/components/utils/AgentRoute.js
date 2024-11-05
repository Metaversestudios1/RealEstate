import React from "react";
import getUserFromToken from "./getUserFromToken";

const AgentRoute = ({ children }) => {
  const { role } = getUserFromToken();
  console.log(role)
  if (role === "agent" || role === "Agent") {
    return children;
  } else {
    return (
      <div>
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white ">
                404
              </h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                Something's missing.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                Sorry, you haven't permission to access this page. You'll find lots to explore on
                the home page.{" "}
              </p>
              <a
                    href="/"
                    className="inline-flex text-white bg-primary-600  font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-blue-900"
                  >
                    Back to Homepage
                  </a>
            </div>
          </div>
        </section>
      </div>
    );
  }
};

export default AgentRoute;
