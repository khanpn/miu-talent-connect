import { AxiosInstance, AxiosRequestConfig } from 'axios';
import restClient from './restClient';

export interface HalLinks {
  [key: string]: {
    href: string;
  };
}

export interface HalEmbedded<T> {
  [key: string]: T[];
}

export interface HalPage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface HalLinksResponse {
  _links: HalLinks;
}

export interface HalResponse<T> extends HalLinksResponse {
  _embedded?: HalEmbedded<T>;
  page?: HalPage;
  [key: string]: any; // Allow for additional metadata
}

class HalClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async fetchSingleResource<T>(url: string): Promise<T & HalLinksResponse> {
    try {
      const response = await this.client.get<T & HalLinksResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching single HAL resource:', error);
      throw error;
    }
  }

  async fetchResource<T>(
    url: string,
    config?: AxiosRequestConfig<T>
  ): Promise<HalResponse<T>> {
    try {
      const response = await this.client.get<HalResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching HAL resource:', error);
      throw error;
    }
  }

  async followLinkOfSigleResource<T>(
    links: HalLinks,
    rel: string
  ): Promise<T & HalLinksResponse> {
    this._validateLink(links, rel);
    return this.fetchSingleResource<T>(links[rel].href);
  }

  async followLink<T>(links: HalLinks, rel: string): Promise<HalResponse<T>> {
    this._validateLink(links, rel);
    return this.fetchResource<T>(links[rel].href);
  }

  private _validateLink(links: HalLinks, rel: string) {
    const link = links[rel];
    if (!link) {
      throw new Error(`Link with rel "${rel}" not found`);
    }
  }
}

const halClient = new HalClient(restClient);

export default halClient;
