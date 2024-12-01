import { readFileSync } from "fs";
import pkg from './public/script.js';
const { processChat } = pkg;

const TXTFILE = "/home/sendai/Videos/clases/Chat de la Clase 13.txt";

const input = readFileSync(TXTFILE, { encoding: 'utf-8' });

console.log(processChat(input))
