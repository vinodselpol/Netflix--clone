// import React, { useState,useEffect } from 'react'
// import "./PlansScreen.css"
// import db from '../firebase'
// import { useSelector } from 'react-redux';
// import { selectUser } from '../features/userSlice';
// import { loadStripe } from '@stripe/stripe-js';


// function PlansScreen() {

//     const [products, setProducts] = useState([]);
//     const user = useSelector(selectUser)
//     const [subscription, setSubscription]= useState(null);

//     useEffect(()=> {
//         db.collection("customers")
//         .doc(user.uid)
//         .collection("subscription")
//         .get()
//         .then((querySnapshot)=> {
//             querySnapshot.forEach(async (subscription)=> {
//                 setSubscription({
//                     role: subscription.data().role,
//                     current_period_end : subscription.data().current_period_end.seconds,
//                     current_period_start: subscription.data().current_period_start.seconds,
//                 })
//             })
//         })
//     }, [user.uid])

//     useEffect(()=>{
//         db.collection("products").where("active", "==", true).get().then((querySnapshot) => {
//             const products ={}
//             querySnapshot.forEach(async (productDoc) => {
//                 products[productDoc.id] = productDoc.data();
//                 const priceSnap = await productDoc.ref.collection("prices").get();
//                 priceSnap.docs.forEach((price) => {
//                     products[productDoc.id].prices = {
//                         priceId: price.id,
//                         priceData:price.data(),
//                     }
//                 })
//             })

//             setProducts(products)
//         })

//     },[])

//     const loadCheckout =async (priceId) => {
//         const docRef = await db.collection("customers")
//         .doc(user.uid)
//         .collection("checkout_sessions")
//         .add({
//             price:priceId,
//             success_url : window.location.origin,
//             cancel_url : window.location.origin,
//         });

//         docRef.onSnapshot(async (snap) =>{
//             const {error, sessionId} = snap.data();

//             if (error) {
//                 //show an error to your customer and 
//                 // inspect your cloud Function logs in  the firebase console.
//                 alert(`An error occured : ${error.message}`)

//             }

//             if (sessionId) {
//                 // we have a session, lets redirect to checkout
//                 // Init Stripe

//                 const stripe = await loadStripe(
//                     "pk_test_51JtssLI2CTRcrb5X2n6Rvl6oajDbvmh6COI9Iwma2RrZhidsgOcgTB2ccxKnOEwEXJjVUWq1XscyKJBr4rXJpoL4001111EGOk"
//                 );

//                 stripe.redirectToCheckout({sessionId})

//             }
//         })


//     }
//   return (
//     <div className='plansScreen'>
//         {Object.entries(products).map(([productId, productData])=> {
//             // TODO add some logic to check if the user's subscription is active...

//             // const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role)
//             const isCurrentPackage = productData.name
//             ?.toLowerCase()
//             .includes(subscription?.role);

//             return (
//                 <div className='plansScreen__plan' >
//                     <div className='plansScreen__info'>
//                         <h5> {productData.name}</h5>
//                         <h6>{productData.description}</h6>
//                     </div>

//                     <button onClick = {() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
//                         {isCurrentPackage ? "Current Package" : "Subscribe"}
//                     </button>


//                 </div >
//             )
//         })}
//     </div>
//   )
// }

// export default PlansScreen

import React, { useState, useEffect } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import { changeSubscription } from "../features/userSlice";
import { useDispatch } from "react-redux";

function PlanScreen() {
    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        db.collection("customers")
            .doc(user.uid)
            .collection("subscriptions")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async (subscription) => {
                    setSubscription({
                        role: subscription.data().role,
                        current_period_end: subscription.data()
                            .current_period_end.seconds,
                        current_period_start: subscription.data()
                            .current_period_start.seconds,
                    });
                });
            });
    }, []);

    useEffect(() => {
        db.collection("products")
            .where("active", "==", true)
            .get()
            .then((querySnapshot) => {
                const products = {};
                querySnapshot.forEach(async (productDoc) => {
                    products[productDoc.id] = productDoc.data();
                    const priceSnap = await productDoc.ref
                        .collection("prices")
                        .get();
                    priceSnap.docs.forEach((price) => {
                        products[productDoc.id].prices = {
                            priceId: price.id,
                            priceData: price.data(),
                        };
                    });
                });
                setProducts(products);
            });
    }, []);

    useEffect(() => {
        if (products && subscription) {
            Object.entries(products).map(([productId, productData]) => {
                const isCurrentPackage = productData.name
                    ?.toLowerCase()
                    .includes(subscription?.role);

                if (isCurrentPackage) {
                    dispatch(changeSubscription(productData.name));
                }
            });
        }
    }, [products, subscription]);

    const loadCheckout = async (priceId) => {
        setIsLoading(true);
        const docRef = await db
            .collection("customers")
            .doc(user.uid)
            .collection("checkout_sessions")
            .add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });

        docRef.onSnapshot(async (snap) => {
            const { error, sessionId } = snap.data();
            if (error) {
                alert("An error occured " + error.message);
            }
            if (sessionId) {
                const stripe = await loadStripe(
                    "pk_test_51JtssLI2CTRcrb5X2n6Rvl6oajDbvmh6COI9Iwma2RrZhidsgOcgTB2ccxKnOEwEXJjVUWq1XscyKJBr4rXJpoL4001111EGOk"
                );

                stripe.redirectToCheckout({ sessionId });
            }
        });
    };

    return (
        <div className="plansScreen">
            <br/>
            {subscription && (
                <p>
                    Renewal date:{" "}
                    {new Date(
                        subscription?.current_period_end * 1000
                    ).toLocaleDateString()}
                </p>
            )}

            {isLoading && <h5>Please wait...</h5>}
            {!isLoading && (
                <>
                    {Object.entries(products).map(
                        ([productId, productData]) => {
                            const isCurrentPackage = productData.name
                                ?.toLowerCase()
                                .includes(subscription?.role);

                            return (
                                <div
                                    key={productId}
                                    className={`${
                                        isCurrentPackage &&
                                        "plansScreen__plan--disabled"
                                    } plansScreen__plan`}
                                >
                                    <div className="plansScreen__info">
                                        <h5>{productData.name}</h5>
                                        <h6>{productData.description}</h6>
                                    </div>

                                    <button
                                        onClick={() =>
                                            !isCurrentPackage &&
                                            loadCheckout(
                                                productData.prices.priceId
                                            )
                                        }
                                    >
                                        {isCurrentPackage
                                            ? "Current Package"
                                            : "Subscribe"}
                                    </button>
                                </div>
                            );
                        }
                    )}
                </>
            )}
        </div>
    );
}

export default PlanScreen;