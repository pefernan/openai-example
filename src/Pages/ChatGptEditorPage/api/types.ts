export enum RESPONSE_TYPE {
    SUCCES = "success",
    FAILURE = "failure"
}

export type OpenAiSession = {
    diagram: string;

    interactions: ChatGptInteraction[]
}

export type SuccessfulChatGptResponse = {
    type: RESPONSE_TYPE.SUCCES,
    diagram: string;
}

export type UnssuccessfulChatGptResponse = {
    type: RESPONSE_TYPE.FAILURE;
    message: string;
}

export type ChatGptResponse = SuccessfulChatGptResponse | UnssuccessfulChatGptResponse

export type ChatGptInteraction = {
    uuid: string;
    request: string;
    response?: ChatGptResponse
}