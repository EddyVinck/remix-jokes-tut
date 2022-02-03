import { ActionFunction, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That joke is too short`;
  }
}

function validateJokeName(name: string) {
  if (name.length < 2) {
    return `That joke's name is too short`;
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const name = body.get("name");
  const content = body.get("content");

  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({
    data: fields,
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form
        method="post"
        aria-aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <div>
          <label>
            Name:{" "}
            <input
              defaultValue={actionData?.fields?.name}
              type="text"
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-describedby={
                actionData?.fieldErrors?.name ? `name-error` : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name && (
            <p id="name-error" className="form-validation-error" role="alert">
              {actionData.fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-describedby={
                actionData?.fieldErrors?.content ? `content-error` : undefined
              }
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content && (
            <p
              id="content-error"
              className="form-validation-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          )}
        </div>
        <div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}