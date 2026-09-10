import mongoose from "mongoose";
import Review from "./review.model.js"

const productSchema = new mongoose.Schema({
    
        title:{
          type:String,
          required:true
        },
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true
        },
        stock:{
            type:Number,
            required:true
        },
        images:[
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        
        imagepublicid:{
            type:String
        },
        category:{
            type:String,
            required:true
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        rating:{
            type:Number,
            default:0,
        },
        numReviews:{
            type:Number,
            default:0,
        }, 
        brand:{
            type:String,
            default:"Bazario Official"
        },
        mrp:{
            type:Number,
        },
        warranty:{
            type:String,
            default:"1 Year Brand Warranty"
        },
        returnPolicy:{
            type:String,
            default:"7 Days Doorstep Replacement"
        },
        highlights:[
            {
                type:String
            }
        ],
        specifications:[
            {
                key:{ type: String },
                value:{ type: String }
            }
        ],
        color:{
            type:String
        },
        size:{
            type:String
        },
        weight:{
            type:String
        },
},
{
    timestamps:true
}
)

productSchema.methods.updateRating=async function(){
    const reviews= await Review.find({
        product:this._id,
    });

    console.log(reviews);

    this.numReviews=reviews.length;

    if(reviews.length === 0){
        this.rating = 0;
    }else{
        const totalRating=reviews.reduce((acc,review)=>acc+review.rating,0);
        this.rating=totalRating/reviews.length;
    }
    console.log(this.rating);
    await this.save();

    console.log("rating update");
}

const Product = mongoose.model("Product",productSchema);
export default Product;
