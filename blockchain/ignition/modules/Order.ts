import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OrderModule = buildModule("OrderModule", (m) => {
  // This tells Ignition to deploy the "Data" contract we just made!
  const orderContract = m.contract("Order");

  return { orderContract };
});

export default OrderModule;


