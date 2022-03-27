import axios from "axios";

export const apiGetRequest = async (url: string) => {
    const { data } = await axios.get(url);
    return data;
};

export const apiPostRequest = async (url: string, postData: any) => {
    const { data } = await axios.post(url, postData);
    return data;
};
