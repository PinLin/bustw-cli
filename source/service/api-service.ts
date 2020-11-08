import axios from 'axios';
import { GetDataVersionDto } from '../dto/get-data-version';

const host = 'http://localhost:3000'

export async function getDataVersion(city: string) {
  const response = await axios.get(`${host}/data-version/${city}`);
  return response.data as GetDataVersionDto;
}