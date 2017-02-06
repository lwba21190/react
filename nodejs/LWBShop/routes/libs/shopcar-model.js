var mongoose = require("mongoose");

module.exports = function() {
    var clientShopCarSchema = new mongoose.Schema({
        accountName: String,
        cartInfo: {
            vendors: [{
                shopId: Number,
                shopName: String,
                vendorPrice: Number,
                isSelected: Boolean,
                sorted: [{
                    propertyTags: {
                        a: String,
                        b: String
                    },
                    Name: String,
                    Num: Number,
                    Price: Number,
                    ImgUrl: String,
                    cid: Number,
                    isSelected: Boolean
                }]
            }],
            Num: Number,
            Price: Number,
            isSelected: Boolean
        }
    });

    var itemChangeToUpdateShop = function() {

    }

    clientShopCarSchema.statics.findAllCartInfo = function(accountName, callback) {
        return this.findOne({ "accountName": accountName }, { "_id": 0, "accountName": 1, "cartInfo": 1 }, callback);
    };

    clientShopCarSchema.statics.insertCartInfo = function(accountName, orignalInfo, newInfo, callback) {
        var that = this;
        var accountName = orignalInfo.accountName;
        var cartInfo = orignalInfo.cartInfo;
        var vendors = [];
        var i = 0;
        for (; i < newInfo.vendors[0].sorted.length; i++) {
            var j = 0;
            for (; j < cartInfo.vendors[0].sorted.length; j++) {
                if (cartInfo.vendors[0].sorted[j].cid == newInfo.vendors[0].sorted[i].cid) {
                    cartInfo.vendors[0].sorted[j].Num += 1;
                    break;
                }
            }
            if (j == cartInfo.vendors[0].sorted.length) {
                cartInfo.vendors[0].sorted.push(newInfo.vendors[0].sorted[i]);
            }
        }
        if (!newInfo.vendors[0].isSelected) {
            cartInfo.vendors[0].isSelected = false;
            cartInfo.isSelected = false;
        }
        cartInfo.vendors[0].vendorPrice = parseFloat((cartInfo.vendors[0].vendorPrice + newInfo.vendors[0].vendorPrice).toFixed(2));
        cartInfo.Price = parseFloat((cartInfo.Price + newInfo.Price).toFixed(2));
        cartInfo.Num += newInfo.Num;
        that.update({ "accountName": accountName }, { $set: { "cartInfo": cartInfo } }, function(err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        })
    }

    clientShopCarSchema.statics.updateCartInfo = function(accountName, newInfo, callback) {
        var that = this;
        return that.findOne({ "accountName": accountName }, { "_id": 0 }, function(err, result) {
            var cartInfo = result.cartInfo;
            switch (newInfo.cmd) {
                case 0:
                    { //全选按钮操作
                        cartInfo.isSelected = newInfo.params.isSelected;
                        cartInfo.Num = 0;
                        cartInfo.Price = 0;
                        for (var i = 0; i < cartInfo.vendors.length; i++) {
                            cartInfo.vendors[i].isSelected = newInfo.params.isSelected;
                            cartInfo.vendors[i].vendorPrice = 0;
                            for (var j = 0; j < cartInfo.vendors[i].sorted.length; j++) {
                                cartInfo.vendors[i].sorted[j].isSelected = newInfo.params.isSelected;
                                if (cartInfo.isSelected) {
                                    cartInfo.Num += cartInfo.vendors[i].sorted[j].Num;
                                    cartInfo.Price += cartInfo.vendors[i].sorted[j].Price;
                                    cartInfo.vendors[i].vendorPrice += cartInfo.vendors[i].sorted[j].Price;
                                }
                            }
                        }
                        break;
                    }
                case 1:
                    { //商店操作
                        cartInfo.vendors[newInfo.params.shopId].isSelected = newInfo.params.isSelected;
                        if (!cartInfo.vendors[newInfo.params.shopId].isSelected) {
                            cartInfo.isSelected = false;
                            for (var k = 0; k < cartInfo.vendors[newInfo.params.shopId].sorted.length; k++) {
                                cartInfo.Num -= cartInfo.vendors[newInfo.params.shopId].sorted[k].Num;
                            }
                            cartInfo.Price = parseFloat((cartInfo.Price - cartInfo.vendors[newInfo.params.shopId].vendorPrice).toFixed(2));
                            cartInfo.vendors[newInfo.params.shopId].vendorPrice = 0;
                        } else {
                            cartInfo.vendors[newInfo.params.shopId].vendorPrice = 0;
                            for (var n = 0; n < cartInfo.vendors[newInfo.params.shopId].sorted.length; n++) {
                                cartInfo.vendors[newInfo.params.shopId].vendorPrice += cartInfo.vendors[newInfo.params.shopId].sorted[n].Price;
                                cartInfo.Num += cartInfo.vendors[newInfo.params.shopId].sorted[n].Num;
                            }
                            cartInfo.vendors[newInfo.params.shopId].vendorPrice = parseFloat(cartInfo.vendors[newInfo.params.shopId].vendorPrice.toFixed(2));
                            cartInfo.Price = 0;
                            cartInfo.isSelected = true;
                            for (var o = 0; o < cartInfo.vendors.length; o++) {
                                cartInfo.Price += cartInfo.vendors[o].vendorPrice;
                                cartInfo.isSelected = cartInfo.isSelected && cartInfo.vendors[o].isSelected;
                                if (!cartInfo.isSelected) {
                                    break;
                                }
                            }
                            cartInfo.Price = parseFloat(cartInfo.Price.toFixed(2));
                        }
                        for (var l = 0; l < cartInfo.vendors[newInfo.params.shopId].sorted.length; l++) {
                            cartInfo.vendors[newInfo.params.shopId].sorted[l].isSelected = newInfo.params.isSelected;
                        }
                        break;
                    }
                case 2:
                    { //商品操作
                        var shopInfo1 = cartInfo.vendors[newInfo.params.shopId];
                        var commodityInfo = shopInfo1.sorted[newInfo.params.commodityId];
                        switch (newInfo.params.cmd) {
                            case 0:
                                { //商品按钮操作
                                    commodityInfo.isSelected = newInfo.params.isSelected;
                                    var diffPrice = commodityInfo.Num * commodityInfo.Price;
                                    if (commodityInfo.isSelected) {
                                        cartInfo.Price = parseFloat((cartInfo.Price + diffPrice).toFixed(2));
                                        shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice + diffPrice).toFixed(2));
                                        cartInfo.Num += commodityInfo.Num;
                                    } else {
                                        cartInfo.Price = parseFloat((cartInfo.Price - diffPrice).toFixed(2));
                                        shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice - diffPrice).toFixed(2));
                                        cartInfo.Num -= commodityInfo.Num;
                                    }
                                    break;
                                }
                            case 1:
                                { //减操作
                                    commodityInfo.Num -= 1;
                                    commodityInfo.isSelected = true;
                                    shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice - commodityInfo.Price).toFixed(2));
                                    cartInfo.Price = parseFloat((cartInfo.Price - commodityInfo.Price).toFixed(2));
                                    cartInfo.Num -= 1;
                                    break;
                                }
                            case 2:
                                { //加操作
                                    commodityInfo.Num += 1;
                                    commodityInfo.isSelected = true;
                                    shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice + commodityInfo.Price).toFixed(2));
                                    cartInfo.Price = parseFloat((cartInfo.Price + commodityInfo.Price).toFixed(2));
                                    cartInfo.Num += 1;
                                    break
                                }
                            case 4:
                                { //删除操作
                                    if (shopInfo1.sorted.length == 1) {
                                        cartInfo = null;
                                        that.remove({ "accountName": accountName }, function(err) {
                                            if (err) {
                                                callback(err);
                                                return;
                                            }
                                            callback(null, null);
                                        });
                                        return;
                                    }
                                    if (commodityInfo.isSelected) {
                                        var diff = commodityInfo.Price * commodityInfo.Num;
                                        shopInfo1.vendorPrice = parseFloat((shopInfo1.vendorPrice - diff).toFixed(2));
                                        cartInfo.Price = parseFloat((cartInfo.Price - diff).toFixed(2));
                                        cartInfo.Num -= commodityInfo.Num;
                                    }
                                    shopInfo1.sorted.splice(newInfo.params.commodityId, 1);
                                    break;
                                }
                            default:
                                {
                                    console.log("暂不支持该操作");
                                    return;
                                }
                        }
                        if (newInfo.params.cmd< 4) {
                            shopInfo1.sorted[newInfo.params.commodityId] = commodityInfo;
                        }
                        shopInfo1.isSelected = true;
                        for (var j = 0; j < shopInfo1.sorted.length; j++) {
                            shopInfo1.isSelected = shopInfo1.isSelected && shopInfo1.sorted[j].isSelected;
                            if (!shopInfo1.isSelected) {
                                break;
                            }
                        }
                        cartInfo.vendors[newInfo.params.shopId] = shopInfo1;
                        cartInfo.isSelected = true;
                        for (var m = 0; m < cartInfo.vendors.length; m++) {
                            cartInfo.isSelected = cartInfo.isSelected && cartInfo.vendors[m].isSelected;
                            if (!cartInfo.isSelected) {
                                break;
                            }
                        }
                        break;
                    }
                case 3:
                    { //其他按钮操作
                        var cid = parseInt(newInfo.params.info.wareId);
                        var commodityItems = cartInfo.vendors[0].sorted;
                        for (var i = 0; i < cartInfo.vendors.length; i++) {
                            if (cartInfo.vendors[i].shopId === -1) {
                                var price = parseFloat(newInfo.params.info.jdPrice);
                                var j = 0;
                                for (; j < cartInfo.vendors[i].sorted.length; j++) {
                                    if (cid == cartInfo.vendors[i].sorted[j].cid) {
                                        cartInfo.vendors[i].sorted[j].isSelected = true;
                                        cartInfo.vendors[i].sorted[j].Num++;
                                        break;
                                    }
                                }
                                if (j == cartInfo.vendors[i].sorted.length) {
                                    var info = {};
                                    var propertyTags = {};
                                    propertyTags.a = null;
                                    propertyTags.b = null;
                                    info.propertyTags = propertyTags;
                                    info.Name = newInfo.params.info.wname;
                                    info.Num = 1;
                                    info.Price = price;
                                    info.ImgUrl = newInfo.params.info.imageurl.substr(newInfo.params.info.imageurl.indexOf("jfs"));
                                    info.cid = parseInt(newInfo.params.info.wareId);
                                    info.isSelected = true;
                                    cartInfo.vendors[i].sorted.push(info);
                                }
                                cartInfo.vendors[i].vendorPrice = parseFloat((cartInfo.vendors[i].vendorPrice + price).toFixed(2));
                                cartInfo.Num++;
                                cartInfo.Price = parseFloat((cartInfo.Price + price).toFixed(2));
                                cartInfo.vendors[i].isSelected = true;
                                for (var n = 0; n < cartInfo.vendors[i].sorted.length; n++) {
                                    cartInfo.vendors[i].isSelected = cartInfo.vendors[i].isSelected && cartInfo.vendors[i].sorted[n].isSelected;
                                    if (!cartInfo.vendors[i].isSelected) {
                                        break;
                                    }
                                }
                                cartInfo.isSelected = true;
                                for (var k = 0; k < cartInfo.vendors.length; k++) {
                                    cartInfo.isSelected = cartInfo.isSelected && cartInfo.vendors[k].isSelected;
                                    if (!cartInfo.isSelected) {
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                default:
                    {
                        console.log("暂不支持该操作");
                        return;
                    }
            }
            that.update({ "accountName": accountName }, { $set: { "cartInfo": cartInfo } }, function(err) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, cartInfo);
            });
        });
    };

    return mongoose.model('shopcar', clientShopCarSchema, 'shopcar');
};