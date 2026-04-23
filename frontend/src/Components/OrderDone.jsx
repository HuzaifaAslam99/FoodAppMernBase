import ConfirmOrder from "../Components/ConfirmOrder"
import { useCart } from '../CartContext';

function OrderDone() {

  const {confirmOrder} = useCart();
  return (
    <>

        { confirmOrder ?
        <>
        <ConfirmOrder/>
        <div className="overlay fixed w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.4)]"></div>
        </>:
        (<></>)
        }

    </>
  )
}

export default OrderDone







fetch('https://gateway.pinata.cloud/ipfs/bafkreihfcl2gqo7grhisj4bajzpdh4yufwjenwd6yaplugj65oxkaxczty')
  .then(res => res.text())
  .then(data => console.log("The 'Normal' Data is:", data))
  .catch(err => console.error("Error fetching IPFS data:", err));