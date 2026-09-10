import {useForm} from "react-hook-form";
import { createProduct } from "../../features/product/productAPI";
import {useNavigate} from "react-router-dom";
import ProductForm from "../../component/product/ProductForm";


function  AddProduct(){
    const navigate=useNavigate();

    const {register,handleSubmit,}=useForm();

    const onSubmit= async (data)=>{
        try{
            const formData=new FormData();

            formData.append("title",data.title);
            // formData.append("brand",data.brand);
            formData.append("category",data.category);
            formData.append("description",data.description);
            // formData.append("mrp",data.mrp);
            formData.append("price",data.price);
            formData.append("stock",data.stock);

            if(data.images && data.images.length > 0){
                for(let i=0;i<data.images.length;i++){
                    formData.append("images",data.images[i]);
                }
            }

            await createProduct(formData);
            alert("Product Added Successfully");
            navigate("/seller/products");

        }catch(error){
            alert(error.response?.data?.message || "Something went wrong");
        }
    }


    return (
        <div>
            <h1>Add product</h1>
            <ProductForm onSubmit={onSubmit}/>
        </div>
    )
}

export default AddProduct;