import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
        orderClient:{//
            type:String,
            required:true,
            validate: value => {
                if (value === 'brak'){
                    throw new Error('Wybierz zleceniodawcę!')
                }
            }
        },
        currency:{//
            type:String,
            required:true,
        },
        carForOrder:{//
            type:String,
            required:true,
            validate: value => {
                if (value === 'brak'){
                    throw new Error('Wybierz Samochód!')
                }
            }
        },
        commision:{//
            type:Number,
        },
        interest:{//
            type:Number,
            validate: value => {
                if (value === 'brak'){
                    throw new Error('Wybierz prowizję!')
                }
            }
        },
        driver:{//
            type:String,
            required:true,
            validate: value => {
                if (value === 'brak'){
                    throw new Error('Wybierz kierowcę!')
                }
            }
        },
        orderNumber:{//
            type:String,
        },
        contaktPersonEmail:{//
            type:String,
        },
        emptyKM:{//
            type:Number,
        },
        fullKM:{//
            type:Number,
        },
        averageForFullKm:{
            type:Number,
        },
        averageForAllKm:{
            type:Number,
        },
        allKM:{//
            type:Number,
        },
        loadingDate:{//
            type:String,
        },
        unloadingDate:{//
            type:String,
        },
        loadingAdress:{//
            lAdress:String,
            lPostCode:String,
        },
        unloadingAdress:{//
            uAdress:String,
            uPostCode:String,
        },
        cargo:{//
            type:String,
        },
        loadedCargo:{
            type:String,
        },
        price:{//
            type:Number,
        },
        statusOrder:{
            type:Number,
            default:1,
        },
        autoMailing:{
            type:Number,
            default:1,
        },
        statusMailing:{
            type:Number,
            default:1,
        },
        orderMembership:{
            type:String,
        },
        orderTakeDate:{
            type:String,
        },
        image:{
            type:String,
        }
    });
    const Order = mongoose.model('Order', OrderSchema)
    export default Order