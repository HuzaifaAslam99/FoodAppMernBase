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
