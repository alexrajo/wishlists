import { useEffect } from "react";
import { HttpRequestMethod } from "../config/types";
import { HOST } from "../config/variables";
import useAuth from "./useAuth";

type AuthorizedRequestProps = {
  endpoint: string;
  method: HttpRequestMethod;
  onSuccess?: (statusCode?: number, responseData?: JSON) => void;
  onFailure?: (statusCode?: number) => void;
  onError?: () => void;
};

const useAuthorizedRequest = (props: AuthorizedRequestProps) => {
  const { endpoint, method, onSuccess, onFailure, onError } = props;
  const { authToken, refreshAuthToken } = useAuth();

  const getRequestObject = (body?: object) =>
    new Request(HOST + endpoint, {
      method: method,
      mode: "cors",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `JWT ${authToken}`,
      },
      body: JSON.stringify(body),
    });

  const send = (requestBody: object) => {
    const request = getRequestObject(requestBody);

    fetch(request)
      .then((res: Response) => {
        if (res.status === 401) refreshAuthToken();
        if (!res.ok) {
          console.log(
            `Failure when calling endpoint '${endpoint}' with authorized request: ` +
              res.status.toString()
          );
          if (onFailure !== undefined) onFailure(res.status);
          return;
        }
        if (onSuccess !== undefined) {
          res.json().then((jsonData) => onSuccess(res.status, jsonData));
        }
      })
      .catch((e) => {
        console.error(e);
        if (onError !== undefined) onError();
      });
  };

  return { getRequestObject, send };
};

export default useAuthorizedRequest;
