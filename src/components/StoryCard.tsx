import React from "react";
import { graphql, useFragment } from "react-relay";

import { StoryCard_story$key } from "__generated__/StoryCard_story.graphql";

const StoryCardFragment = graphql`
  fragment StoryCard_story on Story {
    by {
      username
    }
    title
    url
  }
`;

interface StoryCardProps {
  story: StoryCard_story$key;
}

export const StoryCard: React.FC<StoryCardProps> = (props) => {
  const story = useFragment<StoryCard_story$key>(
    StoryCardFragment,
    props.story
  );

  return (
    <div className="border border-black">
      <span>
        <span>{story.title}</span>
        <span className="font-xs">({story.url})</span>{" "}
      </span>
      <h2>by: {story.by?.username}</h2>
    </div>
  );
};
