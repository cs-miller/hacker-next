import React from "react";
import Link from "next/link";
import { graphql, useFragment } from "react-relay";

import { StoryCard_story$key } from "__generated__/StoryCard_story.graphql";
import { formatDistanceStrict, fromUnixTime } from "date-fns/fp";

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
    score
    descendants
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
  const hasDescendants = story.descendants && story.descendants > 0;
  const creationDate = fromUnixTime(story.time);

  return (
    <li className="bg-white shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md">
      {hasUrl ? (
        <>
          <a href={story.url}>{story.title}</a>
          <a href={story.url}>({new URL(story.url).hostname})</a>
        </>
      ) : (
        <Link href={`/story/${story.id}`}>
          <a>{story.title}</a>
        </Link>
      )}
      <div>
        <span>
          {story.score ?? 0} point{story.score !== 1 && "s"}{" "}
        </span>
        <span>
          by{" "}
          <Link href={`/user/${story.by.id}`}>
            <a>{story.by.username}</a>
          </Link>{" "}
        </span>
        <span>{formatDistanceStrict(Date.now(), creationDate)} ago</span>{" "}
        {hasDescendants ? (
          <span>
            <Link href={`/story/${story.id}`}>
              <a>
                {story.descendants} comment{story.descendants !== 1 && "s"}
              </a>
            </Link>
          </span>
        ) : (
          <Link href={`/story/${story.id}`}>
            <a>discuss</a>
          </Link>
        )}
      </div>
    </li>
  );
};
