import React, { useEffect, useState, useRef } from 'react'
import api from '../../utils/api'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaLongArrowAltLeft, FaDownload } from "react-icons/fa"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function Billing() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [billing, setBilling] = useState(null)
  const [taxAmount, setTaxAmount] = useState(null)
  const { id } = useParams()
  const billRef = useRef()
  const [discount, setDiscount] = useState(null)
  const user = useSelector(state => state.authSlice.userData)
  const navigate = useNavigate()
  const [totalPrice, setTotalPrice] = useState(null)
  const [totalDiscount, setTotalDiscount] = useState()

  useEffect(() => {
    const fetchDiscounts = async () => {
      if (id) {
        try {
          const res = await api.get(`/discount/all/${id}`)
          if (!res.data.success) {
            setError("Could not find discount")
            return
          }
          setDiscount(res.data.validDiscounts)
        } catch (error) {
          setError(error.message)
          navigate("/server-error")
        }
      }
    }
    fetchDiscounts()
  }, [id, navigate])

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await api.get(`/bill/${id}`)
        if (!res.data.success) {
          setError("Something went wrong")
          return
        }
        setBilling(res.data.data)
      } catch (error) {
        navigate("/server-error")
      } finally {
        setLoading(false)
      }
    }
    fetchBill()
  }, [id, navigate])

  useEffect(() => {
    const price = discount && discount.reduce((start, dis) => start + dis.discount_price, 0)
    if (price <= 0) {
      setTotalDiscount(null)
      return
    }
    setTotalDiscount(price)
  }, [discount])

  useEffect(() => {
    if (billing) {
      const price = billing.order_items.reduce((start, item) => start + item.total_price, 0)
      setTotalPrice(price)
    }
  }, [billing])

  useEffect(() => {
    if (totalPrice > 0) {
      const tax = totalPrice * (18 / 100)
      setTaxAmount(tax)
    }
  }, [totalPrice])


  const handleDownload = async () => {
    if (!billRef.current || !billing) return
    try {

      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 500)))

      const element = billRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`bill_${billing.bill_no}.pdf`)
    } catch (err) {
      console.error("PDF Download error:", err)
      alert("Failed to generate PDF")
    }
  }

  return (
    <>
      {!loading ? (
        billing ? (
          <div className="min-h-screen w-full px-10 py-5 bg-gray-50 flex flex-col">
   
            <div className="flex w-full justify-between mb-4">
              <Link to={'/'} className="p-2 rounded-full h-fit bg-gray-300 inline-block">
                <FaLongArrowAltLeft />
              </Link>
              <button
                onClick={handleDownload}
                className="px-4 mb-2 py-2 bg-blue-500 flex items-center gap-2 text-white rounded mt-4"
              >
                Download <FaDownload />
              </button>
            </div>

            <div className="flex flex-col md:flex-row w-full gap-6">
         
              <div className="w-full md:w-1/2">
                <div>
                  <h1 className="text-xl font-semibold">Billing Details</h1>
                  <div className="flex flex-col mt-4">
                    <h1>People</h1>
                    <div className="border-2 mt-2 flex justify-between items-center p-4 rounded border-slate-600 w-1/2">
                      <p>{user.full_name}</p>
                      <span className="py-1 bg-green-500 px-5 text-white rounded-full h-fit w-fit">
                        Buyer
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col mt-5">
                    <span className="text-gray-500">Address</span>
                    <p>{billing.order.address}</p>
                  </div>
                  <div className="flex flex-col mt-5">
                    <span className="text-gray-500">Contact No.</span>
                    <p>{billing.order.user_phone}</p>
                  </div>
                </div>
              </div>

      
              <div
                ref={billRef}
                className="bg-white p-6 rounded shadow-lg max-w-[800px] w-full mx-auto border border-gray-300"
              >
                <div className="h-10 w-full border-b-2 border-b-black items-center flex ">
                  <h1 className="text-xl font-semibold">{billing.bill_no}</h1>
                </div>

                <div className="flex justify-between p-6 text-black">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-gray-500 text-xs">Generated Date</span>
                      <h2>{new Date(billing.createdAt).toDateString()}</h2>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Billed To</span>
                      <h2>{user.email}</h2>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-gray-500 text-xs">Status</span>
                      <h2>
                        {billing.order.status}
                      </h2>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Payment Mode</span>
                      <h2>{billing.order.payment_mode || "COD"}</h2>
                    </div>
                  </div>
                </div>

                <div className="h-10 justify-between py-1 px-2 text-slate-800 items-center w-full bg-slate-300 flex ">
                  <p>DESCRIPTION</p>
                  <div className="flex gap-5">
                    <p>QTY</p>
                    <p>UNIT PRICE</p>
                    <p>AMOUNT</p>
                  </div>
                </div>

                <div className="flex flex-col">
                  {billing.order_items.map(o => (
                    <div
                      key={o._id}
                      className="h-10 justify-between py-1 px-2 text-slate-800 items-center w-full border-b border-b-slate-300 flex"
                    >
                      <h1>{o.product_id.name}</h1>
                      <div className="flex gap-14">
                        <p>{o.quantity}</p>
                        <p>{o.unit_price}</p>
                        <p>{o.total_price}</p>
                      </div>
                    </div>
                  ))}
                </div>

      
                <div className="mt-6 space-y-2 text-right pr-4">
                  <div className="flex justify-end gap-10">
                    <p>SubTotal Amount</p>
                    <p>${totalPrice}</p>
                  </div>
                  {totalDiscount && totalDiscount > 0 && (
                    <div className="flex justify-end gap-10">
                      <p>Total Discount</p>
                      <p>${totalDiscount}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-10">
                    <p>Total Tax</p>
                    <p>${taxAmount && taxAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-end gap-10 font-semibold">
                    <p>Total Amount</p>
                    <p>
                      ${(
                        totalPrice - (totalDiscount || 0) + (taxAmount || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Invalid order ID or You may have not checked Out</p>
        )
      ) : (
        <h1>Loading bill...</h1>
      )}
    </>
  )
}

export default Billing
