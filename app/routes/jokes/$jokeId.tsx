import { Joke } from "@prisma/client";
import { LoaderFunction, useLoaderData, useParams } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = Joke;
export const loader: LoaderFunction = async ({ params }) => {
  const { jokeId } = params;
  const joke = await db.joke.findUnique({
    where: { id: jokeId },
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = joke;
  return data;
};

export default function JokeRoute() {
  const joke = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
