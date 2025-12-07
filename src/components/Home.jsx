import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../utils/api";
import productImg from "../assets/products.png"
import { useEffect } from "react";
import NavBar from "./NavBar";
import filterImg from "../assets/filter.png"
import starImg from "../assets/stars.png"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState('default')
  const [filter, setFilter] = useState("")
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      console.log(res.data);
      if (res.data.success) {
        const flatted = res.data.data.flat()
        console.log(flatted)
        setProducts(flatted)
        setFilteredProducts(flatted)
      }
    } catch (error) {
      setError(error.message)
      return navigate("server-error")
    }
  };
  useEffect(() => {
    fetchProducts()
    products && products.map(prod => console.log(prod))
  }, [])
  const navigate = useNavigate()
  const handleDelete = async (prodId) => {
    try {
      const res = await api.delete(`products/delete/${prodId}`)
      if(res.data.success){
        toast.success("Product deleted successfully")
        console.log('deleted successfully')
        fetchProducts()
      }
    } catch (error) {
      console.log(error)
      toast.error("Could not delete product")
      setError("error occured")
      return navigate("/server-error")
    }
  }
  const handleFilter = async (e) => {
    setFilter(e.target.value)
    if (e.target.value === ""){
      setFilteredProducts(products)
    }
    const prods = products.filter(p => p.prod.name.toLowerCase().includes(e.target.value.toLowerCase().trim()))
    setFilteredProducts(prods)
  }
  const handleClear = () => {
    setFilter("")
    setFilteredProducts(products)
  }
  const handlePriceFilter = (e) => {
    const filter = e.target.value
    let prods = products
    console.log(filter)
    switch (filter) {
      case "below200":
        prods = products.filter(p => p.prod.price < 200);
        break;
      case "200-500":
        prods = products.filter(p => p.prod.price >= 200 && p.prod.price <= 500);
        break;
      case "500-1000":
        prods = products.filter(p => p.prod.price >= 500 && p.prod.price <= 1000);
        break
      case "1000-2000":
        prods = products.filter(p => p.prod.price >= 1000 && p.prod.price <= 2000);
        break
      case "above2000":
        prods = products.filter(p => p.prod.price >= 2000);
        break
      default:
      prods = products
      break
    }
    
    setFilteredProducts(prods)
  //  if (filter === "inc"){
  //    let sorted = [...filteredProducts].sort((a,b) => a.prod.price - b.prod.price)
  //    console.log(sorted, 'sorted by price')
  //    setFilteredProducts(sorted)
  //    return
  //  }
  //   if (e.target.value === "dec"){
  //   let sorted = [...filteredProducts].sort((a,b) => b.prod.price - a.prod.price)
  //   setFilteredProducts(sorted)
  //   }
    

  }
  const handleQuantityFilter = (e) => {
    const filter = e.target.value
   if (filter === "inc"){
    console.log("here:", filter)

     let sorted = [...filteredProducts].sort((a,b) => a.variants.reduce((start, item) => start + item.quantity, 0) - b.variants.reduce((start, item) => start + item.quantity, 0))
     console.log("sorted", sorted)
     setFilteredProducts(sorted)
     return
   }
    else if (e.target.value === "dec"){
    let sorted = [...filteredProducts].sort((a,b) => b.variants.reduce((start, item) => start + item.quantity, 0) - a.variants.reduce((start, item) => start + item.quantity, 0))
    console.log("sorted dec", sorted)
    setFilteredProducts(sorted)
    }

  }
  const handleNameFilter = (e) => {
    let filter = e.target.value
   if (filter === "inc"){
    console.log("here:", filter)
     let sorted = [...filteredProducts].sort((a,b) => a.prod.name.localeCompare(b.prod.name))
     console.log("sorted", sorted)
     setFilteredProducts(sorted)
     console.log(filteredProducts)
     return
   }
    else if (filter === "dec"){
    let sorted = [...filteredProducts].sort((a,b) => b.prod.name.localeCompare(a.prod.name))
    console.log("sorted dec", sorted)
    setFilteredProducts(sorted)
    }

  }
  
  useEffect(() => {
    console.log("Filteredprodcts changed!:", filteredProducts)
  }, [filteredProducts])
  return (
    <>
      <div className="h-full bg-[#ECEEF1] w-screen overflow-x-hidden">
        <div className="">
         <NavBar />
          <div className=" bg-white shadow-md shadow-black/20 py-3 mx-auto px-5 rounded-lg text-center w-[95%]">
            <div className=" flex items-center gap-6">
              <div className="w-auto flex items-center gap-1">
                <div className="h-8">
                  <img
                    className="h-full w-full  object-cover"
                    src={filterImg}
                    alt=""
                  />
                </div>
                <h3>Filter</h3>
                <input value={filter}
                onChange={(e) =>  handleFilter(e)}
                  placeholder="Search Products"
                  className="w-[70%] p-2 rounded-lg border border-slate-300"
                  type="text"
                />
                <button onClick={() => handleClear()}  className="bg-[#E5E7EB] py-1 px-2 ml-2 rounded-md font-light">
                  Clear
                </button>
              </div>
              <div className="flex items-center">
                <p>Price:</p>
                <select onChange={(e) => handlePriceFilter(e)} className="bg-gray-200 rounded ml-2 p-1" id="">
                  <option value="below200">
                    Below 200
                  </option>
                      <option value="200-500">
                    200-500
                  </option>
                   <option value="500-1000">
                    500-1000
                  </option>
                   <option value="1000-2000">
                    1000-2000
                  </option>
                   <option value="above2000">
                    Above 2000
                  </option>
                </select>
              </div>
              <div className="flex items-center">
                <p>Weights:</p>
                <select onChange={(e) => handleQuantityFilter(e)} className="bg-gray-200 rounded ml-2 p-1" id="">
                  <option value="inc">
                    Lower
                  </option>
                      <option value="dec">
                    Higher
                  </option>
                </select>
              </div>
                <div className="flex items-center">
                <p>Name:</p>
                <select onChange={(e) => handleNameFilter(e)} className="bg-gray-200 rounded ml-2 p-1" id="">
                  <option value="inc">
                    A-Z
                  </option>
                      <option value="dec">
                    Z-A
                  </option>
                </select>
              </div>
            </div>
          </div>
       
        </div>
           <div className="flex flex-col h-auto  mt-5">
            <div className="w-full flex items-center justify-center">
              <div className="text-2xl py-3 flex gap-2 w-fit px-5 rounded-lg text-center items-center shadow-md shadow-black/10 justify-center">
                <div className="h-10 overflow-hidden text-center">
                  <img
                    className="h-full w-full object-cover"
                    src={starImg}
                    alt=""
                  />
                </div>
                <h1 className="text-4xl font-bold">
                  Choose Your Desired Product Here!
               
                </h1>
              </div>
            </div>
          </div>
            <div className="flex h-full items-center px-20 justify-start mt-5 flex-wrap gap-5 py-2">
                   {
                    filteredProducts && filteredProducts.length > 0 && filteredProducts.map(product => (
                       <div key={product.prod._id} className=" mt-4 h-auto min-h-[30rem] w-[26rem] shadow-lg shadow-black/50  px-10  py-10 rounded-lg overflow-hidden">
                          <div className="overflow-hidden h-40">
                        <img className="h-full w-full object-contain" src={productImg} alt="" />
                          </div>
                         <div className="flex flex-col text-2xl items-center ">
                           <h1>Product: {product.prod.name} </h1>
                           <p>Description: {product.prod.description.slice(0,10)}....</p>
                            <p>Price: {product.prod.price}</p>
                           <hr />
                          <div className="flex flex-col mt-8 gap-3">
                            <p>Created: {new Date(product.prod.createdAt).toDateString()} </p>
                            <p>Updated: {new Date(product.prod.updatedAt).toDateString()}</p>
                            <p>Quantity:{product.variants.reduce((start, item) => start+ item.quantity, 0)}</p>
                          </div>
                           <h3 className="text-start mt-2">Variants</h3>
                          <div className="Variants flex gap-6 w-full">
                             
                            <div className=" flex gap-7 p-2 rounded justify-between w-full">
                             {
                              product.variants.map((variant,i) => (
                                   <div value={variant._id} key={variant._id} className=" cursor-pointer bg-white border-2 p-2 border-solid border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:border-white duration-300 ease-linear">
                                        <p>{variant.variant_name}</p>
                                   <p>{variant.variant_value}</p>
                                    <p>{variant.price}</p>
                                
                                </div>
                              ))
                             }
                           
                       
                           
                          </div>
                           </div>
                           
                          <div className="flex gap-5 mt-6">
                            <Link to={`update-product/${product.prod._id}`} className="border py-1 px-3 text-md  border-black text-center flex items-center rounded-lg hover:text-white hover:bg-blue-500 " >Update</Link>
                             <button onClick={() => handleDelete(product.prod._id)} className="border py-1 px-3 text-md  border-black rounded-lg hover:text-white hover:bg-red-500 " >Delete</button>
                             
                          </div>
                         </div>

                      </div>
                    ))
                  }
                 </div>
      </div>
    </>
  );
}

export default Home;
