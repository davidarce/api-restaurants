import { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { axiosInstanceConnector } from '../core/axios-instance.connector';
import { uriParser } from '../utils/uri-parser.util';
import configuration from '../config'
import { SearchHistory } from "../entity/SearchHistory";
import { User } from "../entity/User";
import { getRepository } from "typeorm";

interface IRestaurantQuery {
    location: string,
    latitude: number,
    longitude: number
}

interface IRestaurantResponse {
    name: string,
    alias: string,
    image_url: string,
    url: string,
    rating: string,
    coordinates: any,
    range_price: string,
    phone: string,
    location: any
}

class RestaurantService {

    constructor(private axiosInstance: AxiosInstance = axiosInstanceConnector) {
    }

    public search(query: IRestaurantQuery, user: User): Promise<any> {
        const url: string = uriParser(configuration.endpoints.getBusinesses, query);
        const headers: any = { authorization: `Bearer ${configuration.apiKey}` };
        return new Promise((resolve: any, reject: any) => {
            this.axiosInstance.get(url, {
                headers,
                transformResponse: this.transformBusinessesData
            })
                .then((response: AxiosResponse) => {
                    this.saveSearchHistory(query, user);
                    resolve({
                        restaurants: response.data
                    });
                })
                .catch((error: AxiosError) => {
                    const errorData: any = (error.response && error.response.data) || error.message;
                    reject(errorData);
                });
        });
    }

    public getSearchHistory(userId: number, limit: number): Promise<SearchHistory[]> {
        const seatchHistoryRepository = getRepository(SearchHistory);
        return new Promise(async (resolve: any, reject: any) => {
            try {
                const searchHistory: SearchHistory[] = await seatchHistoryRepository
                    .createQueryBuilder('searchHistory')
                    .leftJoinAndSelect('searchHistory.user', 'user')
                    .where('user.id = :id', { id: userId })
                    .select(['searchHistory.id', 'searchHistory.city', 'searchHistory.latitude', 'searchHistory.longitude', 'searchHistory.createdAt', 'user.username'])
                    .limit(limit)
                    .getMany();

                resolve(searchHistory);
            } catch (error) {
                reject(error);
            }
        });
    }

    private saveSearchHistory(query: IRestaurantQuery, user: User): void {
        const searchHistory = new SearchHistory();
        searchHistory.city = query.location;
        searchHistory.latitude = +query.latitude;
        searchHistory.longitude = +query.longitude;
        searchHistory.user = user;

        const seatchHistoryRepository = getRepository(SearchHistory);
        seatchHistoryRepository.save(searchHistory);
    }

    private transformBusinessesData(data: any): IRestaurantResponse[] {
        try {
            let response = JSON.parse(data);
            return response.businesses.map(business => {
                const { address1: address, city, country } = business.location
                const restaurant: IRestaurantResponse = {
                    name: business.name,
                    alias: business.alias,
                    image_url: business.image_url,
                    url: business.url,
                    rating: business.rating,
                    coordinates: business.coordinates,
                    range_price: business.price,
                    phone: business.phone,
                    location: { address, city, country }
                }
                return restaurant;
            });
        } catch (error) {
            throw Error(`[requestClient] Error parsing response JSON data - ${JSON.stringify(error)}`)
        }
    }
}

export default new RestaurantService();