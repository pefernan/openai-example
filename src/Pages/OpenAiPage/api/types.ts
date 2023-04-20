
export enum RESPONSE_TYPE {
    SUCCES = "success",
    FAILURE = "failure"
}

export type OpenAiResponse = {
    type: RESPONSE_TYPE;
    message: string;
    diagram?: string
}

export type OpenAiInteraction = {
    uuid: string;
    request: string;
    response?: OpenAiResponse
}