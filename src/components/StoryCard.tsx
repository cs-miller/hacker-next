import React from "react";
import Link from "next/link";
import { graphql, useFragment } from "react-relay";

import { StoryCard_story$key } from "__generated__/StoryCard_story.graphql";
import { formatRelative, fromUnixTime } from "date-fns/fp";

const StoryCardFragment = graphql`
  fragment StoryCard_story on Story {
    id
    by {
      id
      username
    }
    title
    url
    time
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

  const hasUrl = story.url !== null;
  const creationDate = fromUnixTime(story.time);

  return (
    <li className="bg-white shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md">
      {hasUrl ? (
        <span>
          <a href={story.url}>{story.title}</a>
          <a href={story.url}>({story.url})</a>
        </span>
      ) : (
        <Link href={`/story/${story.id}`}>
          <a>{story.title}</a>
        </Link>
      )}
      <div>
        by{" "}
        <Link href={`/user/${story.by.id}`}>
          <a>{story.by.username}</a>
        </Link>{" "}
        <span>{formatRelative(Date.now(), creationDate)}</span>
      </div>
    </li>
  );
};
