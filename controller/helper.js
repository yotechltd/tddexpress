class OrderHelper {
    // #GetBacsRefund returns a number denotes total bacs refunded amount of an order.
    getBacsRefundedAmount(o){
        let total = o.refund_source.map((r) => r.gateway === "terminal" || r.gateway === "bacs" ? r.amount : 0)
            .reduce((t, a) => t + a, 0);
        if(o.orderSourceProcessor=="otter" || o.orderSourceProcessor === "epos_manual"){
            total = o.refund_source.map((r) => o.gateway === "voucher" || r.gateway === "rewardpay" || r.gateway === "wallet" || r.gateway === "checkout" || r.gateway === "stripe" || r.gateway === "card" || r.gateway === "googlepay" || r.gateway === "paypal" || r.gateway === "alipay" || r.gateway === "checkout" ? r.amount : 0)
                .reduce((t, a) => t + a, 0);
        }
        //let extraCharges = o.orderOrigin === "epos" || o.orderSourceProcessor=="otter" || o.orderSourceProcessor === "epos_manual" || o.payment_gateway === "bacs" || o.payment_gateway === "terminal" || o.payment_gateway2 === "bacs" || o.payment_gateway2 === "terminal" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));

        return total;
    }

    // #GetCardRefund returns a number denotes total refunded amount by card of an order.
    getCardRefundedAmount(o){
        let total = o.refund_source.map((r) => r.gateway === "checkout" || r.gateway === "rewardpay" || r.gateway === "wallet" || r.gateway === "stripe" || r.gateway === "card" || r.gateway === "googlepay" || r.gateway === "paypal" || r.gateway === "alipay" || r.gateway === "checkout" ? r.amount : 0)
            .reduce((t, a) => t + a, 0);
        // o.is_company_cashback === false && total > o.total_price ? total = total - (o.cashback_discount + o.point_amount) : null;
        let extraCharges = o.orderOrigin === "epos" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
    
        if(o.pay_by_link && o.orderOrigin === "epos"){
            total = total > o.total_price ? (total - (o.serviceCharge || 0)) : total;
        }else {
            total = total > o.total_price && o.orderOrigin === "online" ? total - extraCharges : total;
        }
        return total;
    }

    // #GetCashRefund returns a number of total amount refunded by cash //
    getCashRefundedAmount(o) {
        let total = o.refund_source.map((r) => r.gateway === "cash" ? r.amount : 0)
            .reduce((t, a) => t + a, 0);
        return total;
    }

    // #GetRefundedAmount returns an object whit property card, cash, bacs and total which represent card refunded amount, cash refunded amount, bacs refunded amount and total of them respectively
    getRefundedAmount(o){
        let card = 0,
            cash = 0,
            bacs = 0;
        o.refund_source.map((r)=>{
            if(r.gateway === "cash"){
                cash += r.amount;
            } else if((r.gateway === "checkout" || r.gateway === "rewardpay" || r.gateway === "wallet" || r.gateway === "stripe" || r.gateway === "card" || r.gateway === "googlepay" || r.gateway === "paypal" || r.gateway === "alipay" || r.gateway === "checkout") && (o.orderSourceProcessor !== "otter" && o.orderSourceProcessor !== "epos_manual")) {
                card += r.amount;
            } else if( r.gateway === "terminal" || r.gateway === "bacs" || ((o.orderSourceProcessor === "otter" || o.orderSourceProcessor === "epos_manual") && (r.gateway === "checkout" || r.gateway === "rewardpay" || r.gateway === "wallet" || r.gateway === "stripe" || r.gateway === "card" || r.gateway === "googlepay" || r.gateway === "paypal" || r.gateway === "alipay" || r.gateway === "checkout"))){
                bacs += r.amount;
            }
        });

        let extraCharges = o.orderOrigin === "epos" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));

        if(o.pay_by_link && o.orderOrigin === "epos"){
            card = card > o.total_price ? (card - (o.serviceCharge || 0)) : card;
        }else {
            card = card > o.total_price && o.orderOrigin === "online" ? card - extraCharges : total;
        }
        return {
            card,
            cash,
            bacs,
            total: +(card + cash + bacs).toFixed(2)
        };
    }
    
    // getTotalSpentCardRefund : (o) => {
    //     let total = o.refund_source.map((r) => r.gateway === "checkout" || r.gateway === "stripe" || r.gateway === "card" || r.gateway === "googlepay" || r.gateway === "paypal" || r.gateway === "alipay"  ? r.amount : 0)
    //         .reduce((t, a) => t + a, 0);
    //     // o.is_company_cashback === false && total > o.total_price ? total = total - (o.cashback_discount + o.point_amount) : null;
    //     let extraCharges = o.orderOrigin === "epos" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
    //
    //     if(o.pay_by_link && o.orderOrigin === "epos"){
    //         total = total > o.total_price ? (total - (o.serviceCharge || 0)) : total;
    //     }else {
    //         total = total > o.total_price && o.orderOrigin === "online" ? total - extraCharges : total;
    //     }
    //     return total;
    // },
    
    isCardPayment(o) {
        //  Returns true or false based on card or cash
        return (o.payment_gateway2 === "voucher" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "rewardpay" || o.payment_gateway2 === "checkout");
    }
    
    spentCheckCard(o){
         //  Returns true or false based on card or cash
        return (o.payment_gateway === "card" || o.payment_gateway === "stripe" || o.payment_gateway === "googlepay" || o.payment_gateway === "alipay" || o.payment_gateway === "paypal"  || o.payment_gateway === "checkout" || o.payment_gateway2 === "card" || o.payment_gateway2 === "stripe" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal"  || o.payment_gateway2 === "checkout")
    }
    
    isCashPayment(o){
        // Returns true if payment method is cash or else false
        if(o.orderSourceProcessor === "otter" || o.orderSourceProcessor === "epos_manual"){
            return o.payment_method === "cash"; 
        }
        return o.payment_gateway === "cash" || o.payment_gateway2 === "cash";
    }
    getBacsAmount(o){
        if(o.orderSourceProcessor === "otter" || o.orderSourceProcessor === "epos_manual"){
            return o.total_app_price;
        } else if(o.payment_gateway === "terminal" || o.payment_gateway2 === "terminal"){
            if(o.payment_gateway === "terminal"){
                let extraCharges = o.orderOrigin === "epos" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
                let amount = o.payment_gateway_amount - extraCharges;
                if(o.payment_gateway2 === "terminal"){
                    amount += o.payment_gateway2_amount;
                }
                return amount;
            } else if(o.payment_gateway2 === "terminal"){
                let extraCharges = o.orderOrigin === "epos" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
                let amount = o.payment_gateway2_amount - extraCharges
                return amount;
            }
        } else if(o.payment_gateway === "bacs" || o.payment_gateway2 === "bacs") {
            return o.total_price;
        } else return 0;
    }


    // #GetEposOrderTotalAmount returns a object containing card amount, cash amount, bacs amount and total of them respectively ;
    getEposOrderTotalAmount(o) {
        let card = 0,
            cash = 0,
            bacs = 0;
        if(o.orderSourceProcessor === "otter" || o.orderSourceProcessor === "epos_manual"){
            if(o.payment_method === "card") bacs = o.total_app_price;
            if(o.payment_method === "cash") cash = o.total_app_price;
        } else if(o.payment_gateway === "terminal" || o.payment_gateway2 === "terminal"){
            if(o.payment_gateway === "terminal"){
                let extraCharges = o.orderOrigin === "epos" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
                let amount = o.payment_gateway_amount - extraCharges;
                if(o.payment_gateway2 === "terminal"){
                    amount += o.payment_gateway2_amount;
                }
                bacs = amount;
            } else if(o.payment_gateway2 === "terminal"){
                let extraCharges = o.orderOrigin === "epos" ? 0 : ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
                let amount = o.payment_gateway2_amount - extraCharges;
                bacs = amount;
            }
        } else if(o.payment_gateway === "bacs" || o.payment_gateway2 === "bacs") {
            bacs = o.total_price;
        }
        if(o.orderSourceProcessor !== "otter" || o.orderSourceProcessor !== "epos_manual"){
            if(o.payment_gateway === "stripe" || o.payment_gateway === "card" || o.payment_gateway === "googlepay" || o.payment_gateway === "alipay" || o.payment_gateway === "paypal" || o.payment_gateway === "wallet" || o.payment_gateway === "voucher" || o.payment_gateway === "rewardpay" || o.payment_gateway === "checkout"){
                let amount = o.payment_gateway_amount;
                if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "checkout"){
                    amount += o.payment_gateway2_amount;
                }
                if(o.pay_by_link){
                    amount = amount - o.serviceCharge;
                }
                card = amount;
            } else if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "rewardpay" || o.payment_gateway2 === "checkout"){
                let amount = o.payment_gateway2_amount
                if(o.pay_by_link){
                    amount = amount - o.serviceCharge;
                }
                card = amount;
            } else if(o.pay_by_link){
                card = o.payment_gateway_amount - (o.serviceCharge || 0);
            }
        }
        // cash = o.payment_gateway === "cash" ? o.payment_gateway_amount : o.payment_gateway2 === "cash" ? o.payment_gateway2_amount : 0;
        if(o.payment_gateway === "cash" ) cash = o.payment_gateway_amount;
        if(o.payment_gateway_amount2 === "cash") cash = o.payment_gateway2_amount;
        if(o.payment_gateway2 === "cash" && o.payment_gateway === "cash") cash = o.payment_gateway_amount + o.payment_gateway2_amount;
        return {
            card,
            cash,
            bacs,
            total: card+cash+bacs
        };
    }

    // #GetEposCardOrderAmount returns a number with epos card amount
    getEposOrderCardAmount(o){
        if(o.orderSourceProcessor==="otter" || o.orderSourceProcessor === "epos_manual" || o.paying_terminal === "bacs_transfer") {
            return 0;
        }
        if(o.payment_gateway === "stripe" || o.payment_gateway === "card" || o.payment_gateway === "googlepay" || o.payment_gateway === "alipay" || o.payment_gateway === "paypal" || o.payment_gateway === "wallet" || o.payment_gateway === "voucher" || o.payment_gateway === "rewardpay" || o.payment_gateway === "checkout"){
            let amount = o.payment_gateway_amount;
            if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "checkout"){
                amount += o.payment_gateway2_amount;
            }
            if(o.pay_by_link){
                amount = amount - o.serviceCharge;
            }
            return amount;
        } else if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "rewardpay" || o.payment_gateway2 === "checkout"){
            let amount = o.payment_gateway2_amount
            if(o.pay_by_link){
                amount = amount - o.serviceCharge;
            }
            return amount;
        } else if(o.pay_by_link){
            return o.payment_gateway_amount - (o.serviceCharge || 0);
        } else return 0;
    }
    
    // spentValtCardOrderAmount : (o) => {
    //     if(o.orderSourceProcessor=="otter" || o.orderSourceProcessor === "epos_manual" || o.paying_terminal === "bacs_transfer") {
    //         return 0;
    //     }
    //     if(o.payment_gateway === "stripe" || o.payment_gateway === "card" || o.payment_gateway === "googlepay" || o.payment_gateway === "alipay" || o.payment_gateway === "paypal"  || o.payment_gateway === "checkout"){
    //         let amount = o.payment_gateway_amount;
    //         if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal"  || o.payment_gateway2 === "checkout"){
    //             amount += o.payment_gateway2_amount;
    //         }
    //         if(o.pay_by_link){
    //             amount = amount - o.serviceCharge;
    //         }
    //         return amount;
    //     } else if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "checkout"){
    //         let amount = o.payment_gateway2_amount
    //         if(o.pay_by_link){
    //             amount = amount - o.serviceCharge;
    //         }
    //         return amount;
    //     } else if(o.pay_by_link){
    //         return o.payment_gateway_amount - (o.serviceCharge || 0);
    //     } else return 0;
    // },
    
    getOnlineOrderCardAmount(o){
        if(o.orderSourceProcessor==="otter" || o.orderSourceProcessor === "epos_manual" || o.paying_terminal === "bacs_transfer") {
            return 0;
        }
        if(o.payment_gateway === "stripe" || o.payment_gateway === "card" || o.payment_gateway === "googlepay" || o.payment_gateway === "alipay" || o.payment_gateway === "paypal" || o.payment_gateway === "wallet" || o.payment_gateway === "voucher" || o.payment_gateway === "rewardpay" || o.payment_gateway === "checkout"){
            let extraCharges = ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
            let amount = o.payment_gateway_amount - extraCharges;
            if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "checkout"){
                amount += o.payment_gateway2_amount;
            }
            amount = amount + (o.reward_order && o.payment_gateway !== "rewardpay" ? o.reward_order.reward_order_amount ? o.reward_order.reward_order_amount : 0 : 0);
            return amount;
        }else if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "rewardpay" || o.payment_gateway2 === "checkout"){
            let extraCharges = ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
            let amount = o.payment_gateway2_amount - extraCharges;
            amount = amount + (o.reward_order ? o.reward_order.reward_order_amount ? o.reward_order.reward_order_amount : 0 : 0);
            return amount;
        } else return 0;
    }
    
    getSpentOnlineOrderCardAmount(o){
        if(o.orderSourceProcessor==="otter" || o.orderSourceProcessor === "epos_manual" || o.paying_terminal === "bacs_transfer") {
            return 0;
        }
        if(o.payment_gateway === "stripe" || o.payment_gateway === "card" || o.payment_gateway === "googlepay" || o.payment_gateway === "alipay" || o.payment_gateway === "paypal" || o.payment_gateway === "checkout"){
            let extraCharges = ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
            let amount = o.payment_gateway_amount - extraCharges;
            if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal"  || o.payment_gateway2 === "checkout"){
                amount += o.payment_gateway2_amount;
            }
            return amount;
        }else if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "checkout"){
            let extraCharges = ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
            let amount = o.payment_gateway2_amount - extraCharges;
            return amount;
        } else return 0;
    }


    getOnlineOrderTotalAmount(o){
        let card = 0,
            cash = 0,
            bacs = 0;
        // if(o.orderSourceProcessor==="otter" || o.orderSourceProcessor === "epos_manual" || o.paying_terminal === "bacs_transfer") {
        //     card = 0;
        //     cash = o.total_app_price;
        // }

        if(o.payment_gateway === "cash"){
            cash = o.payment_gateway_amount;
            if(o.payment_gateway2 === "cash"){
                cash += o.payment_gateway2_amount;
            } else if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "rewardpay" || o.payment_gateway2 === "checkout"){
                let extraCharges = ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
                card = o.payment_gateway2_amount - extraCharges;
                card = card + (o.reward_order ? o.reward_order.reward_order_amount ? o.reward_order.reward_order_amount : 0 : 0);
            }
        } else if(o.payment_gateway === "stripe" || o.payment_gateway === "card" || o.payment_gateway === "googlepay" || o.payment_gateway === "alipay" || o.payment_gateway === "paypal" || o.payment_gateway === "wallet" || o.payment_gateway === "voucher" || o.payment_gateway === "rewardpay" || o.payment_gateway === "checkout"){
            let extraCharges = ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
            card = o.payment_gateway_amount - extraCharges;
            if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "checkout"){
                card += o.payment_gateway2_amount;
            } else if(o.payment_gateway2 === "cash") cash = o.payment_gateway2_amount;
            card = amount + (o.reward_order && o.payment_gateway !== "rewardpay" ? o.reward_order.reward_order_amount ? o.reward_order.reward_order_amount : 0 : 0);
        }
        // else if(o.payment_gateway2 === "stripe" || o.payment_gateway2 === "card" || o.payment_gateway2 === "googlepay" || o.payment_gateway2 === "alipay" || o.payment_gateway2 === "paypal" || o.payment_gateway2 === "wallet" || o.payment_gateway2 === "voucher" || o.payment_gateway2 === "rewardpay" || o.payment_gateway2 === "checkout"){
        //     let extraCharges = ((o.serviceCharge || 0) + (o.point_amount || 0) + (o.is_company_cashback === false ? o.cashback_discount || 0 : 0) + (o.charity_amt || 0) + (o.notificationcharge || 0));
        //     card = o.payment_gateway2_amount - extraCharges;
        //     card = amount + (o.reward_order ? o.reward_order.reward_order_amount ? o.reward_order.reward_order_amount : 0 : 0);
        // }
        return {
            cash,
            card,
            bacs,
            total: cash + card + bacs
        };
    }
    // #OnlineOrderCashAmount return a number of cash amount
    getOnlineOrderCashAmount(o){
        if(o.orderSourceProcessor === "otter" || o.orderSourceProcessor === "epos_manual"){
            return o.total_app_price;
        }
        return o.payment_gateway === "cash" ? o.payment_gateway_amount : o.payment_gateway2 === "cash" ? o.payment_gateway2_amount : 0;
    }

    // #EposOrderCashAmount return a number of cash amount
    getEposOrderCashAmount(o){
        if(o.orderSourceProcessor==="otter" || o.orderSourceProcessor === "epos_manual"){
            return o.total_app_price;
        }
        let amount = o.payment_gateway  === "cash" ? o.payment_gateway_amount : o.payment_gateway2 === "cash" ? o.payment_gateway2_amount : 0;
        return amount;
    }

    // #isBacsPayment returns if the payment is completed with bacs or not
    isBacsPayment(o){
        return (o.payment_gateway === "terminal" || o.payment_gateway2 === "terminal" || o.payment_gateway === "bacs" || o.payment_gateway2 === "bacs" || ((o.orderSourceProcessor==="otter" || o.orderSourceProcessor === "epos_manual")&& o.payment_method !== "cash"));
    }
    
    orderFilter(orders, permission, orderOrigin, deposit, orderType, thirdParty, refunded, giftCard, notPaid){
        let orderList = orders.filter(o => {
            if(o.requested_at_date && o.requested_at_date > o.dateordered && o.orderOrigin === "epos"){} 
            else{
                if(permission[o.rid].third_party_order_processing === false && permission[o.rid].show_notpaid_in_summary === false){
                    if(o.orderSourceProcessor != "otter" && o.orderSourceProcessor != "epos_manual" && (o.payment_status === "Paid" || o.deposit_amount > 0)){
                        return orderByTypes(o, orderOrigin, deposit, orderType, thirdParty, refunded, giftCard, notPaid);
                    }
                } else if(permission[o.rid].third_party_order_processing === false){
                    if(o.orderSourceProcessor != "otter" && o.orderSourceProcessor != "epos_manual"){
                        return orderByTypes(o, orderOrigin, deposit, orderType, thirdParty, refunded, giftCard, notPaid);
                    }
                } else if(permission[o.rid].show_notpaid_in_summary === false){
                    if((o.payment_status === "Paid" || o.deposit_amount > 0) && !notPaid){
                        return orderByTypes(o, orderOrigin, deposit, orderType, thirdParty, refunded, giftCard, notPaid);
                    }
                } else {
                    return orderByTypes(o, orderOrigin, deposit, orderType, thirdParty, refunded, giftCard, notPaid);
                }
            }
        });
        return orderList;
    }
    getOtherData(item){
        item.hide_order_t = false;
        if ((item.hasOwnProperty("isRefunded") && item.isRefunded === "Y") ||
            item.refund_status === 1) {
            item.refundButton = false;
        } else if (item.status === "accepted" || item.status === "printed") {
            item.refundButton = true;
        }
        /* Order Condition Copied from Dipen on 11 Febr 2021 */
        if (item.order_type === 3) {
            switch (item.progress_status) {
                case 1:
                    item.orderStatus = "Preparing";
                    break;
                case 2:
                    item.orderStatus = "On Its Way";
                    break;
                case 0:
                    item.orderStatus = "Delivered";
                    break;
            }
        } else {
            if (item.order_type === 4 || item.order_type === 2) {
                switch (item.progress_status) {
                    case 1:
                        item.orderStatus = "Preparing";
                        break;
                    case 2:
                        item.orderStatus = "Ready";
                        break;
                    case 0:
                        item.orderStatus = "Collected";
                        break;
                }
            }
        }
        /* End Order Condition Copied from Dipen on 11 Febr 2021 */
        item.paynow = false;
        item.middlebar = true;
        item.confirmtext = "New Order";
        item.progresstext = "Calling";
        item.completiontext = "Accepted";
    
        if (item.status === "New") {
            item.progress = "";
            item.outofdelivery = "";
            item.reviewbutton = false;
            item.reorderbutton = false;
            item.completion = "";
            item.orderProgressButton = false;
        } else if (item.status === "calling") {
            item.progress = "";
            item.outofdelivery = "complete";
            item.reorderbutton = false;
            item.completion = "";
            item.orderProgressButton = false;
        } else if (item.status === "review") {
            item.confirmtext = "Waiting for Review";
            item.progress = "";
            item.outofdelivery = "";
            item.waiting = true;
            item.reorderbutton = false;
            item.completion = "";
            item.orderProgressButton = false;
        } else if (item.status === "printed" || item.status === "accepted") {
            item.completion = "complete";
            item.outofdelivery = "complete";
            item.confirmtext = "Confirmed";
            item.orderProgressButton = true;
    
            if (item.progress_status === 0) {
                item.outofdelivery = "complete";
                item.completion = "complete";
                item.completiontext = "collected";
                if (item.order_type === 3) {
                    item.completiontext = "Delivered";
                    item.progresstext = "Out For Delivery";
                } else if (item.order_type === 2) {
                    item.progresstext = "Ready for Collection";
                    item.completiontext = "Collected";
                }
            }
        } else if (item.status === "rejected") {
            item.completiontext = "Order Rejected";
            item.rejectreason = "";
            item.completion = "complete";
            item.confirmtext = "Confirmed";
            item.orderProgressButton = false;
    
            item.outofdelivery = "complete";
        } else if (item.status === "notpaid") {
            item.middlebar = true;
            item.progresstext = "Waiting for payment";
            item.orderProgressButton = false;
        } else if (item.status === "ordercenceled") {
            item.completiontext = "Order Cancelled";
            item.outofdelivery = "complete";
            item.confirmtext = "Confirmed";
            item.completion = "complete";
            item.orderProgressButton = false;
        } else {
            item.confirmtext = "New Order";
            item.progress = "";
            item.outofdelivery = "";
            item.completion = "";
        }
        if (item.accepted_for) item.accepted_time = item.accepted_for;
        return item;
    }
}

module.export = new OrderHelper();

// const orderByTypes = (o, orderOrigin, deposit, orderType, thirdParty, refunded, giftCard, notPaid) => {
//     if(orderOrigin || orderType || thirdParty || refunded === "true" || giftCard === "true" || notPaid === "true" || deposit === "true"){
//         if(deposit== "true" && o.deposit_amount>0) return o;
//         else if(orderType && o.order_type === orderType) return o;
//         else if(thirdParty && o.orderSource === thirdParty) return o;
//         else if(refunded === "true" && o.payment_status === "Paid" && o.refundedAmount > 0) return o;
//         else if(giftCard === "true" && o.coupon_amount > 0 && (o.payment_gateway === "voucher" || o.payment_gateway2 === "voucher")) return o;
//         else if(notPaid === "true" && o.payment_status === "notpaid") return o;
//         else if(o.orderOrigin === "online" && o.orderOrigin === orderOrigin && !o.deposit_amount && o.orderSourceProcessor != "otter" && o.orderSourceProcessor != "epos_manual") return o;
//         else if(o.orderOrigin === "epos" && o.orderSourceProcessor != "otter" && o.orderSourceProcessor != "epos_manual" && o.orderOrigin === orderOrigin) return o;
//     } else {
//         if((o.orderOrigin === "online" && !o.deposit_amount && o.orderSourceProcessor != "otter" && o.orderSourceProcessor != "epos_manual")
//             || (o.orderOrigin === "epos" && o.orderSourceProcessor != "otter" && o.orderSourceProcessor != "epos_manual")
//             || ((o.orderSourceProcessor=="otter" || o.orderSourceProcessor === "epos_manual") && !o.deposit_amount)) return o;
//     }
// };