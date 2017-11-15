const extend = require('js-base/core/extend');
const PgListDesign = require('ui/ui_pgList');
const ItemProductList = require("../components/ItemProductList");
const Shopify = require("sf-extension-shopify");
const ListViewItem = require('sf-core/ui/listviewitem');
const ListView = require('sf-core/ui/listview');
const FlexLayout = require('sf-core/ui/flexlayout');
const Screen = require('sf-core/device/screen');
const Router = require("sf-core/ui/router");
const Color = require("sf-core/ui/color");
const addContextChild = require("@smartface/contx/lib/smartface/action/addChild");
const Timer = require("sf-core/timer");
const Product = require('../objects/Category');

const ITEM_WIDTH = 170;
const ITEM_HEIGHT = 230;


const PgList = extend(PgListDesign)(
    // Constructor
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        this.onOrientationChange = onOrientationChange.bind(this);
        const page = this;

        page.dataset = null;

    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
    superOnShow();
    fetchData.call(this);
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    redesignListviewItem.call(this);
}

function onOrientationChange() {
    redesignListviewItem.call(this);
}

function fetchData() {
    const params = { "id": 383740422, "title": "Accessories", "image": { "created_at": "2017-06-21T16:50:41-04:00", "width": 728, "height": 409, "src": "https://cdn.shopify.com/s/files/1/1897/7057/collections/Category_4_a953b3c2-fe33-4b85-8ee4-cd662459aed1.png?v=1498078241" } };
    Timer.setTimeout({
        delay: 300,
        task: function() {
            Shopify.Product.getAllProducts().collectionID(params.id).fields(["id", "title", "variants", "image"]).exec(function(response) {
                var arr = [];
                for (var i = 0; i < response.products.length; i++) {
                    var productItem = new Product();
                    productItem = response.products[i];
                    arr.push(productItem);
                }
                this.productList = arr;
                this.dataset = this.productList;
                // this.listView.itemCount = Math.ceil(this.data.length / 2);
                // this.loaderContainer.activityIndicator.visible = false;
                // this.listView.refreshData();
                redesignListviewItem.call(this);
            }.bind(this));
        }.bind(this)
    });
}

function redesignListviewItem() {
    const page = this;
    this.layout.removeChild(this.lvMain);
    this.lvMain = new ListView({
        positionType: FlexLayout.PositionType.RELATIVE,
        flexGrow: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: Color.create(200, 241, 241, 241)
    });

    this.layout.addChild(this.lvMain, "lvMain");

    var id = 0;
    var itemCountPerRow = Math.floor(Screen.width / (ITEM_WIDTH + 20));
    this.lvMain.onRowSelected = function() {
        Router.go("pgWomen");
    };
    this.lvMain.refreshEnabled = false;
    this.lvMain.onRowCreate = function() {
        var listItem = new ListViewItem({
            positionType: FlexLayout.PositionType.ABSOLUTE,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            flexGrow: 1,
            flexDirection: FlexLayout.FlexDirection.ROW,
            justifyContent: FlexLayout.JustifyContent.SPACE_BETWEEN,
            alignItems: FlexLayout.AlignItems.CENTER,
            alignContent: FlexLayout.AlignContent.CENTER,
            //backgroundColor: Color.GRAY,
            id: ++id
        });

        this.lvMain.dispatch(addContextChild("listItems", listItem));

        for (var i = 0; i < itemCountPerRow; ++i) {
            listItem.addChild(Object.assign(new ItemProductList(), {
                positionType: FlexLayout.PositionType.RELATIVE,
                height: ITEM_HEIGHT,
                width: ITEM_WIDTH,
                marginLeft: 10,
                marginRight: 10,
                id: i + 200
            }), "listItem_" + i);
        }

        return listItem;
    }.bind(this);
    this.lvMain.rowHeight = ITEM_HEIGHT + 50;
    this.lvMain.itemCount = Math.ceil(page.dataset.length / itemCountPerRow);
    this.lvMain.onRowBind = function(listViewItem, index) {
        var item, sourceIndex, data;
        for (var i = 0; i < itemCountPerRow; ++i) {
            sourceIndex = (index * itemCountPerRow) + i;
            item = listViewItem.findChildById(i + 200);
            data = page.dataset[sourceIndex];
            if (item && sourceIndex < page.dataset.length) {
                // item.visible = true;
                // item.imgPreview.loadFromUrl(data.image);
                // item.lblPrice.text = "$" + data.price.amount;
                // item.lblName.text = data.name;
                item.product = data;
            }
            else {
                item && (item.visible = false);
            }
        }
    };

    this.lvMain.refreshData();
    this.lvMain.stopRefresh();
}

module && (module.exports = PgList);
