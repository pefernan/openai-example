

export enum RESPONSE_TYPE {
    SUCCES = "success",
    FAILURE = "failure"
}
export type OpenAiResponse = {
    type: RESPONSE_TYPE;
    message: string;
}

export type OpenAiInteraction = {
    uuid: string;
    loading: false;
    request: string;
    response: OpenAiResponse
} | {
    uuid: string;
    loading: true;
    request: string;
}