import {LoadSource} from "../dtos/loadSource";

export const mockSources: LoadSource[] = [
  {id: 1, name: "Kolencentrale", description: "Power plant that generates electricity with the use of charcoal",
    gridLoad: 3.0, price: 10000, color: "#000000", image: 'assets/photos/coal_plant.png'},
  {id: 2, name: "Gascentrale", description: 'Power plant that generates electricity with the use of gas',
    gridLoad: 3.0, price: 10000, color: "#FF0000", image: 'assets/photos/gas_plant.png'},
  {id: 3, name: 'Parkeergarage', description: 'Parkeergarage bestemd voor 400 elektrische voertuigen',
    gridLoad: 0.5, price: 1500, color: "#FFFF00", image: 'assets/photos/electric_parking_lot.png'},
  {id: 4, name: 'Windpark', description: "een groot aantal windturbines op het vaste land",
    gridLoad: 1.5, price: 3000, color: "#029393", image: 'assets/photos/wind_park_2.png'},
  {id: 5, name: 'Industrieterrein', description: "een verzameling van bedrijfspanden en kleine industrie " +
      "op een daarvoor bestemd terrein", gridLoad: 1.0, price: 1000, color: "#663399",
    image: 'assets/photos/industrie_terrein.png'},
  {id: 7, name: 'Windpark op zee', description: 'string', gridLoad: 1.5,
    price: 2000, color: "#0267ff", image: 'assets/photos/windpark_op_zee.png'},
  {id: 8, name: 'Zonneweide', description: 'string', gridLoad: 0.5, price: 500,
    color: "#008000", image: 'assets/photos/solar_field.png'}
]
