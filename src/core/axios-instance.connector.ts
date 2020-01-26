import axios, { AxiosInstance } from 'axios';
import config from '../config';

export class AxiosInstanceFactory {

    private axiosInstance: AxiosInstance;

    constructor(config = {}) {
        this.axiosInstance = axios.create(config);
    }

    instance(): AxiosInstance {
        return this.axiosInstance;
    }

}

export const axiosInstanceConnector: AxiosInstance = new AxiosInstanceFactory({
    timeout: config.defaultTimeout,
}).instance();