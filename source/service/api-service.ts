import axios from 'axios';
import { GetBusRoutesDto } from '../dto/get-bus-route';
import { GetDataVersionDto } from '../dto/get-data-version';

const host = 'http://localhost:3000'

export async function getDataVersion(city: string) {
  const response = await axios.get(`${host}/data-version/${city}`);
  return response.data as GetDataVersionDto;
}

export async function getBusRoutes(city: string) {
  const response = await axios.get(`${host}/route/${city}`);
  return response.data as GetBusRoutesDto;
}
