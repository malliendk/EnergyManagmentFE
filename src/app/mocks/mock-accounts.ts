import {Account} from "../dtos/account";

export const mockAccounts: Account[] = [
  {id: 1, supplyType: 'Shortage', supplyAmount: 0.4, localityName: 'Zutphen'},
  {id: 2, supplyType: 'Shortage', supplyAmount: 0.5, localityName: 'Zutphen'},
  {id: 3, supplyType: 'Optimal', supplyAmount: 0.9, localityName: 'Zutphen'},
  {id: 4, supplyType: 'Optimal', supplyAmount: 1.0, localityName: 'Zutphen'},
  {id: 5, supplyType: 'Surplus', supplyAmount: 1.5, localityName: 'Zutphen'},
  {id: 6, supplyType: 'Surplus', supplyAmount: 1.7, localityName: 'Zutphen'},
]
