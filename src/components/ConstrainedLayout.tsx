import * as React from "react";

export const ConstrainedLayout: React.FC = (props) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">{props.children}</div>
    </div>
  );
};
