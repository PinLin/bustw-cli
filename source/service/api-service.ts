import axios from 'axios';
import { GetBusRoutesDto } from '../dto/get-bus-routes';
import { GetBusInfoDto } from '../dto/get-bus-info';

const host = 'http://localhost:3000'

export async function getBusInfo(city: string) {
  const response = await axios.get(`${host}/bus/city/${city}`);
  return response.data as GetBusInfoDto;
}

export async function getBusRoutes(city: string) {
  const response = await axios.get(`${host}/bus/city/${city}/routes`);
  return response.data as GetBusRoutesDto;
}
