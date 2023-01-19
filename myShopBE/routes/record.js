const express = require('express');
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests.
const recordRoutes = express.Router();

// Import db connection.
const dbo = require('../db/conn');

// This section will help you get a list of all the products in the shop or some products based on the query params.
recordRoutes.route('/shop').get(async (req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('products')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching products!');
      } else {
        const { page, perPage, searchTerm, category, orderBy } = req.query;
        let currentPage;
        currentPage = page ? page : 1;
        let filteredProducts = result.filter( product => {
          let categoryFlag = false;
          if ( category ) {
              for ( let i = 0; i < product.category.length; i++ ) {
                  product.category[ i ].slug === category && ( categoryFlag = true );
              }
          } else {
              categoryFlag = true;
          }
  
          let searchFlag = false;
          if ( searchTerm ) {
              product.slug.includes( searchTerm ) && ( searchFlag = true );
          } else {
              searchFlag = true;
          }
  
          return categoryFlag && searchFlag;
        } )
  
        filteredProducts = filteredProducts.sort( ( a, b ) => {
            return a.id - b.id;
        } )
  
        switch ( orderBy ) {
            case 'new':
                filteredProducts.sort( ( a, b ) => {
                    var newA = ( a.new === true ? 1 : 0 );
                    var newB = ( b.new === true ? 1 : 0 );
                    if ( newA < newB ) {
                        return 1;
                    } else if ( newA === newB ) {
                        return 0;
                    } else {
                        return -1;
                    }
                } );
                break;
            default:
                break;
        }
        res.status(200).json({ 'totalCount': filteredProducts.length, 'products': filteredProducts.slice( ( currentPage - 1 ) * perPage, currentPage * perPage ) });
        return;
      }
    });
});

recordRoutes.route('/products/:slug').get(async (req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('products')
    .findOne({ 'slug': req.params.slug }, async (err, result) => {
      if (err) {
        res.status(400).send('Error fetching products!');
        return;
      } else {
        const { isQuickView } = req.query;
        const entity = result;

        if (isQuickView === 'true') {
            res.status(200).json({'product' : entity});
            return;
        }
      
        let relatedProducts = await dbConnect.collection('products').find({}).toArray();

        var curIndex = -1;
        var prevProduct = null;
        var nextProduct = null;
        relatedProducts.map( ( item, index ) => {
            if ( item[ 'id' ] == entity.id ) curIndex = index;
        } );
        if ( curIndex >= 1 )
            prevProduct = relatedProducts[ curIndex - 1 ];
        else prevProduct = null;

        if ( curIndex < relatedProducts.length - 1 )
            nextProduct = relatedProducts[ curIndex + 1 ];
        else nextProduct = null;

        relatedProducts = relatedProducts.filter( product => {
            return product.id !== entity.id;
        } )

        res.status(200).json({ 'product': entity, 'relatedProducts': relatedProducts.slice( 0, 5 ), 'prevProduct': prevProduct, 'nextProduct': nextProduct });
        return;
      }
    });
});

// This section will save all the products
recordRoutes.route('/products/saveall').post(async (req, res) => {
  const dbConnect = dbo.getDb();
  const products = [
    {
        "id": 87,
        "name": "Beige metal hoop tote bag",
        "slug": "beige-metal-hoop-tote-bag",
        "short_desc": "This is a sample short description.",
        "price": 76,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T01:50:09.080Z",
        "updated_at": "2021-01-24T03:20:04.455Z",
        "pictures": [
            {
                "id": 1626,
                "name": "product-1-1.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-1.jpg",
                        "hash": "thumbnail_product_1_1_45e247fd69",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.27,
                        "url": "/uploads/thumbnail_product_1_1_45e247fd69.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-1.jpg",
                        "hash": "medium_product_1_1_45e247fd69",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 59.17,
                        "url": "/uploads/medium_product_1_1_45e247fd69.jpg"
                    },
                    "small": {
                        "name": "small_product-1-1.jpg",
                        "hash": "small_product_1_1_45e247fd69",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 25.89,
                        "url": "/uploads/small_product_1_1_45e247fd69.jpg"
                    }
                },
                "hash": "product_1_1_45e247fd69",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 56.65,
                "url": "/uploads/product_1_1_45e247fd69.jpg",
                "created_at": "2021-01-05T08:25:45.787Z",
                "updated_at": "2021-01-05T08:25:45.908Z"
            },
            {
                "id": 1625,
                "name": "product-1-2.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-2.jpg",
                        "hash": "thumbnail_product_1_2_3015187804",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.71,
                        "url": "/uploads/thumbnail_product_1_2_3015187804.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-2.jpg",
                        "hash": "medium_product_1_2_3015187804",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 48.48,
                        "url": "/uploads/medium_product_1_2_3015187804.jpg"
                    },
                    "small": {
                        "name": "small_product-1-2.jpg",
                        "hash": "small_product_1_2_3015187804",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 24.22,
                        "url": "/uploads/small_product_1_2_3015187804.jpg"
                    }
                },
                "hash": "product_1_2_3015187804",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 46.52,
                "url": "/uploads/product_1_2_3015187804.jpg",
                "created_at": "2021-01-05T08:25:45.767Z",
                "updated_at": "2021-01-05T08:25:45.881Z"
            },
            {
                "id": 1623,
                "name": "product-1-3.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-3.jpg",
                        "hash": "thumbnail_product_1_3_e6f8d6b032",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.11,
                        "url": "/uploads/thumbnail_product_1_3_e6f8d6b032.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-3.jpg",
                        "hash": "medium_product_1_3_e6f8d6b032",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 61.17,
                        "url": "/uploads/medium_product_1_3_e6f8d6b032.jpg"
                    },
                    "small": {
                        "name": "small_product-1-3.jpg",
                        "hash": "small_product_1_3_e6f8d6b032",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 26.49,
                        "url": "/uploads/small_product_1_3_e6f8d6b032.jpg"
                    }
                },
                "hash": "product_1_3_e6f8d6b032",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 55.57,
                "url": "/uploads/product_1_3_e6f8d6b032.jpg",
                "created_at": "2021-01-05T08:25:45.721Z",
                "updated_at": "2021-01-05T08:25:45.822Z"
            },
            {
                "id": 1624,
                "name": "product-1-4.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-4.jpg",
                        "hash": "thumbnail_product_1_4_f5fa0713da",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.17,
                        "url": "/uploads/thumbnail_product_1_4_f5fa0713da.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-4.jpg",
                        "hash": "medium_product_1_4_f5fa0713da",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 44.99,
                        "url": "/uploads/medium_product_1_4_f5fa0713da.jpg"
                    },
                    "small": {
                        "name": "small_product-1-4.jpg",
                        "hash": "small_product_1_4_f5fa0713da",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 22.53,
                        "url": "/uploads/small_product_1_4_f5fa0713da.jpg"
                    }
                },
                "hash": "product_1_4_f5fa0713da",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 42.78,
                "url": "/uploads/product_1_4_f5fa0713da.jpg",
                "created_at": "2021-01-05T08:25:45.746Z",
                "updated_at": "2021-01-05T08:25:45.852Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 1631,
                "name": "product-1-1-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-1-300x300.jpg",
                        "hash": "thumbnail_product_1_1_300x300_a41bf80b40",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.34,
                        "url": "/uploads/thumbnail_product_1_1_300x300_a41bf80b40.jpg"
                    }
                },
                "hash": "product_1_1_300x300_a41bf80b40",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.5,
                "url": "/uploads/product_1_1_300x300_a41bf80b40.jpg",
                "created_at": "2021-01-05T08:26:39.886Z",
                "updated_at": "2021-01-05T08:26:39.988Z"
            },
            {
                "id": 1632,
                "name": "product-1-2-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-2-300x300.jpg",
                        "hash": "thumbnail_product_1_2_300x300_4d585cfd35",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.75,
                        "url": "/uploads/thumbnail_product_1_2_300x300_4d585cfd35.jpg"
                    }
                },
                "hash": "product_1_2_300x300_4d585cfd35",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 10.25,
                "url": "/uploads/product_1_2_300x300_4d585cfd35.jpg",
                "created_at": "2021-01-05T08:26:39.916Z",
                "updated_at": "2021-01-05T08:26:40.019Z"
            },
            {
                "id": 1633,
                "name": "product-1-3-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-3-300x300.jpg",
                        "hash": "thumbnail_product_1_3_300x300_0a0f9518be",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.15,
                        "url": "/uploads/thumbnail_product_1_3_300x300_0a0f9518be.jpg"
                    }
                },
                "hash": "product_1_3_300x300_0a0f9518be",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.36,
                "url": "/uploads/product_1_3_300x300_0a0f9518be.jpg",
                "created_at": "2021-01-05T08:26:39.934Z",
                "updated_at": "2021-01-05T08:26:40.049Z"
            },
            {
                "id": 1634,
                "name": "product-1-4-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-4-300x300.jpg",
                        "hash": "thumbnail_product_1_4_300x300_48da39ab39",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.2,
                        "url": "/uploads/thumbnail_product_1_4_300x300_48da39ab39.jpg"
                    }
                },
                "hash": "product_1_4_300x300_48da39ab39",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.15,
                "url": "/uploads/product_1_4_300x300_48da39ab39.jpg",
                "created_at": "2021-01-05T08:26:39.951Z",
                "updated_at": "2021-01-05T08:26:40.087Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 88,
        "name": "Beige ring handle circle cross body bag",
        "slug": "beige-ring-handle-circle-cross-body-bag",
        "short_desc": "This is a sample short description.",
        "price": 55,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T06:04:39.309Z",
        "updated_at": "2021-01-11T04:25:10.772Z",
        "pictures": [
            {
                "id": 1643,
                "name": "1-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1-big.jpg",
                        "hash": "thumbnail_1_big_e8af4c1106",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.95,
                        "url": "/uploads/thumbnail_1_big_e8af4c1106.jpg"
                    },
                    "large": {
                        "name": "large_1-big.jpg",
                        "hash": "large_1_big_e8af4c1106",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 118.12,
                        "url": "/uploads/large_1_big_e8af4c1106.jpg"
                    },
                    "medium": {
                        "name": "medium_1-big.jpg",
                        "hash": "medium_1_big_e8af4c1106",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 65.16,
                        "url": "/uploads/medium_1_big_e8af4c1106.jpg"
                    },
                    "small": {
                        "name": "small_1-big.jpg",
                        "hash": "small_1_big_e8af4c1106",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 28.24,
                        "url": "/uploads/small_1_big_e8af4c1106.jpg"
                    }
                },
                "hash": "1_big_e8af4c1106",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 133.88,
                "url": "/uploads/1_big_e8af4c1106.jpg",
                "created_at": "2021-01-07T01:59:46.913Z",
                "updated_at": "2021-01-07T01:59:47.007Z"
            },
            {
                "id": 1644,
                "name": "2-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-big.jpg",
                        "hash": "thumbnail_2_big_2392558dfc",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.78,
                        "url": "/uploads/thumbnail_2_big_2392558dfc.jpg"
                    },
                    "large": {
                        "name": "large_2-big.jpg",
                        "hash": "large_2_big_2392558dfc",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 95.75,
                        "url": "/uploads/large_2_big_2392558dfc.jpg"
                    },
                    "medium": {
                        "name": "medium_2-big.jpg",
                        "hash": "medium_2_big_2392558dfc",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 57.33,
                        "url": "/uploads/medium_2_big_2392558dfc.jpg"
                    },
                    "small": {
                        "name": "small_2-big.jpg",
                        "hash": "small_2_big_2392558dfc",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 26.2,
                        "url": "/uploads/small_2_big_2392558dfc.jpg"
                    }
                },
                "hash": "2_big_2392558dfc",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 117.45,
                "url": "/uploads/2_big_2392558dfc.jpg",
                "created_at": "2021-01-07T01:59:46.940Z",
                "updated_at": "2021-01-07T01:59:47.035Z"
            },
            {
                "id": 1646,
                "name": "3-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3-big.jpg",
                        "hash": "thumbnail_3_big_63d1f6664f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.63,
                        "url": "/uploads/thumbnail_3_big_63d1f6664f.jpg"
                    },
                    "large": {
                        "name": "large_3-big.jpg",
                        "hash": "large_3_big_63d1f6664f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 154.12,
                        "url": "/uploads/large_3_big_63d1f6664f.jpg"
                    },
                    "medium": {
                        "name": "medium_3-big.jpg",
                        "hash": "medium_3_big_63d1f6664f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 94.12,
                        "url": "/uploads/medium_3_big_63d1f6664f.jpg"
                    },
                    "small": {
                        "name": "small_3-big.jpg",
                        "hash": "small_3_big_63d1f6664f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 43.41,
                        "url": "/uploads/small_3_big_63d1f6664f.jpg"
                    }
                },
                "hash": "3_big_63d1f6664f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 184.87,
                "url": "/uploads/3_big_63d1f6664f.jpg",
                "created_at": "2021-01-07T01:59:46.974Z",
                "updated_at": "2021-01-07T01:59:47.102Z"
            },
            {
                "id": 1645,
                "name": "4-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_4-big.jpg",
                        "hash": "thumbnail_4_big_07ea37ae3a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.38,
                        "url": "/uploads/thumbnail_4_big_07ea37ae3a.jpg"
                    },
                    "large": {
                        "name": "large_4-big.jpg",
                        "hash": "large_4_big_07ea37ae3a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 96.75,
                        "url": "/uploads/large_4_big_07ea37ae3a.jpg"
                    },
                    "medium": {
                        "name": "medium_4-big.jpg",
                        "hash": "medium_4_big_07ea37ae3a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 52.83,
                        "url": "/uploads/medium_4_big_07ea37ae3a.jpg"
                    },
                    "small": {
                        "name": "small_4-big.jpg",
                        "hash": "small_4_big_07ea37ae3a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 22.82,
                        "url": "/uploads/small_4_big_07ea37ae3a.jpg"
                    }
                },
                "hash": "4_big_07ea37ae3a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 109,
                "url": "/uploads/4_big_07ea37ae3a.jpg",
                "created_at": "2021-01-07T01:59:46.956Z",
                "updated_at": "2021-01-07T01:59:47.067Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 1647,
                "name": "1.jpg",
                "caption": "",
                "width": 820,
                "height": 820,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1.jpg",
                        "hash": "thumbnail_1_3df6114aa3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.92,
                        "url": "/uploads/thumbnail_1_3df6114aa3.jpg"
                    },
                    "medium": {
                        "name": "medium_1.jpg",
                        "hash": "medium_1_3df6114aa3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 54.65,
                        "url": "/uploads/medium_1_3df6114aa3.jpg"
                    },
                    "small": {
                        "name": "small_1.jpg",
                        "hash": "small_1_3df6114aa3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 27.54,
                        "url": "/uploads/small_1_3df6114aa3.jpg"
                    }
                },
                "hash": "1_3df6114aa3",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 53.97,
                "url": "/uploads/1_3df6114aa3.jpg",
                "created_at": "2021-01-07T02:00:08.155Z",
                "updated_at": "2021-01-07T02:00:08.280Z"
            },
            {
                "id": 1649,
                "name": "2.jpg",
                "caption": "",
                "width": 820,
                "height": 820,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2.jpg",
                        "hash": "thumbnail_2_a2ee45417a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.77,
                        "url": "/uploads/thumbnail_2_a2ee45417a.jpg"
                    },
                    "medium": {
                        "name": "medium_2.jpg",
                        "hash": "medium_2_a2ee45417a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 54.47,
                        "url": "/uploads/medium_2_a2ee45417a.jpg"
                    },
                    "small": {
                        "name": "small_2.jpg",
                        "hash": "small_2_a2ee45417a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 26.98,
                        "url": "/uploads/small_2_a2ee45417a.jpg"
                    }
                },
                "hash": "2_a2ee45417a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 54.65,
                "url": "/uploads/2_a2ee45417a.jpg",
                "created_at": "2021-01-07T02:00:08.221Z",
                "updated_at": "2021-01-07T02:00:08.345Z"
            },
            {
                "id": 1650,
                "name": "3.jpg",
                "caption": "",
                "width": 820,
                "height": 820,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3.jpg",
                        "hash": "thumbnail_3_070f8cc732",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.67,
                        "url": "/uploads/thumbnail_3_070f8cc732.jpg"
                    },
                    "medium": {
                        "name": "medium_3.jpg",
                        "hash": "medium_3_070f8cc732",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 88.32,
                        "url": "/uploads/medium_3_070f8cc732.jpg"
                    },
                    "small": {
                        "name": "small_3.jpg",
                        "hash": "small_3_070f8cc732",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 43.56,
                        "url": "/uploads/small_3_070f8cc732.jpg"
                    }
                },
                "hash": "3_070f8cc732",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 87.06,
                "url": "/uploads/3_070f8cc732.jpg",
                "created_at": "2021-01-07T02:00:08.241Z",
                "updated_at": "2021-01-07T02:00:08.378Z"
            },
            {
                "id": 1648,
                "name": "4.jpg",
                "caption": "",
                "width": 820,
                "height": 820,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_4.jpg",
                        "hash": "thumbnail_4_0f662308da",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.32,
                        "url": "/uploads/thumbnail_4_0f662308da.jpg"
                    },
                    "medium": {
                        "name": "medium_4.jpg",
                        "hash": "medium_4_0f662308da",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 43.25,
                        "url": "/uploads/medium_4_0f662308da.jpg"
                    },
                    "small": {
                        "name": "small_4.jpg",
                        "hash": "small_4_0f662308da",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 21.81,
                        "url": "/uploads/small_4_0f662308da.jpg"
                    }
                },
                "hash": "4_0f662308da",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 43.51,
                "url": "/uploads/4_0f662308da.jpg",
                "created_at": "2021-01-07T02:00:08.202Z",
                "updated_at": "2021-01-07T02:00:08.312Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 89,
        "name": "Beige V neck button cardigan",
        "slug": "beige-v-neck-button-cardigan",
        "short_desc": "This is a sample short description.",
        "price": 72,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T06:06:18.052Z",
        "updated_at": "2021-01-11T04:25:18.697Z",
        "pictures": [
            {
                "id": 1505,
                "name": "product-2-1.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-1.jpg",
                        "hash": "thumbnail_product_2_1_f64862c43b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 5.78,
                        "url": "/uploads/thumbnail_product_2_1_f64862c43b.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-1.jpg",
                        "hash": "medium_product_2_1_f64862c43b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 136.68,
                        "url": "/uploads/medium_product_2_1_f64862c43b.jpg"
                    },
                    "small": {
                        "name": "small_product-2-1.jpg",
                        "hash": "small_product_2_1_f64862c43b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 61.59,
                        "url": "/uploads/small_product_2_1_f64862c43b.jpg"
                    }
                },
                "hash": "product_2_1_f64862c43b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 133.41,
                "url": "/uploads/product_2_1_f64862c43b.jpg",
                "created_at": "2020-12-30T07:26:20.835Z",
                "updated_at": "2020-12-30T07:26:20.953Z"
            },
            {
                "id": 1506,
                "name": "product-2-2.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-2.jpg",
                        "hash": "thumbnail_product_2_2_837fdaeb82",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 5.14,
                        "url": "/uploads/thumbnail_product_2_2_837fdaeb82.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-2.jpg",
                        "hash": "medium_product_2_2_837fdaeb82",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 135.95,
                        "url": "/uploads/medium_product_2_2_837fdaeb82.jpg"
                    },
                    "small": {
                        "name": "small_product-2-2.jpg",
                        "hash": "small_product_2_2_837fdaeb82",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 61.11,
                        "url": "/uploads/small_product_2_2_837fdaeb82.jpg"
                    }
                },
                "hash": "product_2_2_837fdaeb82",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 132.9,
                "url": "/uploads/product_2_2_837fdaeb82.jpg",
                "created_at": "2020-12-30T07:26:20.858Z",
                "updated_at": "2020-12-30T07:26:20.987Z"
            },
            {
                "id": 1507,
                "name": "product-2-3.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-3.jpg",
                        "hash": "thumbnail_product_2_3_ad4fa04b81",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 6.41,
                        "url": "/uploads/thumbnail_product_2_3_ad4fa04b81.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-3.jpg",
                        "hash": "medium_product_2_3_ad4fa04b81",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 172.02,
                        "url": "/uploads/medium_product_2_3_ad4fa04b81.jpg"
                    },
                    "small": {
                        "name": "small_product-2-3.jpg",
                        "hash": "small_product_2_3_ad4fa04b81",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 79.52,
                        "url": "/uploads/small_product_2_3_ad4fa04b81.jpg"
                    }
                },
                "hash": "product_2_3_ad4fa04b81",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 165.93,
                "url": "/uploads/product_2_3_ad4fa04b81.jpg",
                "created_at": "2020-12-30T07:26:20.879Z",
                "updated_at": "2020-12-30T07:26:21.024Z"
            },
            {
                "id": 1504,
                "name": "product-2-4.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-4.jpg",
                        "hash": "thumbnail_product_2_4_761d77686f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.97,
                        "url": "/uploads/thumbnail_product_2_4_761d77686f.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-4.jpg",
                        "hash": "medium_product_2_4_761d77686f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 51.62,
                        "url": "/uploads/medium_product_2_4_761d77686f.jpg"
                    },
                    "small": {
                        "name": "small_product-2-4.jpg",
                        "hash": "small_product_2_4_761d77686f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 24.49,
                        "url": "/uploads/small_product_2_4_761d77686f.jpg"
                    }
                },
                "hash": "product_2_4_761d77686f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 49.34,
                "url": "/uploads/product_2_4_761d77686f.jpg",
                "created_at": "2020-12-30T07:26:20.804Z",
                "updated_at": "2020-12-30T07:26:20.918Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 1508,
                "name": "product-2-1-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-1-300x300.jpg",
                        "hash": "thumbnail_product_2_1_300x300_98e1548d0e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 5.77,
                        "url": "/uploads/thumbnail_product_2_1_300x300_98e1548d0e.jpg"
                    }
                },
                "hash": "product_2_1_300x300_98e1548d0e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 21.25,
                "url": "/uploads/product_2_1_300x300_98e1548d0e.jpg",
                "created_at": "2020-12-30T07:26:53.421Z",
                "updated_at": "2020-12-30T07:26:53.550Z"
            },
            {
                "id": 1509,
                "name": "product-2-2-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-2-300x300.jpg",
                        "hash": "thumbnail_product_2_2_300x300_9f775cd8db",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 5.11,
                        "url": "/uploads/thumbnail_product_2_2_300x300_9f775cd8db.jpg"
                    }
                },
                "hash": "product_2_2_300x300_9f775cd8db",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 20.27,
                "url": "/uploads/product_2_2_300x300_9f775cd8db.jpg",
                "created_at": "2020-12-30T07:26:53.458Z",
                "updated_at": "2020-12-30T07:26:53.590Z"
            },
            {
                "id": 1510,
                "name": "product-2-3-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-3-300x300.jpg",
                        "hash": "thumbnail_product_2_3_300x300_e7bf3012a7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 6.33,
                        "url": "/uploads/thumbnail_product_2_3_300x300_e7bf3012a7.jpg"
                    }
                },
                "hash": "product_2_3_300x300_e7bf3012a7",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 26.43,
                "url": "/uploads/product_2_3_300x300_e7bf3012a7.jpg",
                "created_at": "2020-12-30T07:26:53.488Z",
                "updated_at": "2020-12-30T07:26:53.631Z"
            },
            {
                "id": 1511,
                "name": "product-2-4-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-4-300x300.jpg",
                        "hash": "thumbnail_product_2_4_300x300_55784f7cb0",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.02,
                        "url": "/uploads/thumbnail_product_2_4_300x300_55784f7cb0.jpg"
                    }
                },
                "hash": "product_2_4_300x300_55784f7cb0",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 8.83,
                "url": "/uploads/product_2_4_300x300_55784f7cb0.jpg",
                "created_at": "2020-12-30T07:26:53.515Z",
                "updated_at": "2020-12-30T07:26:53.672Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 90,
        "name": "Black denim dungaree dress",
        "slug": "black-denim-dungaree-dress",
        "short_desc": "This is a sample short description.",
        "price": 60,
        "stock": 203,
        "new": null,
        "created_at": "2020-12-24T06:09:02.901Z",
        "updated_at": "2021-01-11T04:25:24.159Z",
        "pictures": [
            {
                "id": 1498,
                "name": "product-5-2.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-2.jpg",
                        "hash": "thumbnail_product_5_2_092ad839ae",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.68,
                        "url": "/uploads/thumbnail_product_5_2_092ad839ae.jpg"
                    },
                    "large": {
                        "name": "large_product-5-2.jpg",
                        "hash": "large_product_5_2_092ad839ae",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 44.37,
                        "url": "/uploads/large_product_5_2_092ad839ae.jpg"
                    },
                    "medium": {
                        "name": "medium_product-5-2.jpg",
                        "hash": "medium_product_5_2_092ad839ae",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 28.5,
                        "url": "/uploads/medium_product_5_2_092ad839ae.jpg"
                    },
                    "small": {
                        "name": "small_product-5-2.jpg",
                        "hash": "small_product_5_2_092ad839ae",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 14.52,
                        "url": "/uploads/small_product_5_2_092ad839ae.jpg"
                    }
                },
                "hash": "product_5_2_092ad839ae",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 45.29,
                "url": "/uploads/product_5_2_092ad839ae.jpg",
                "created_at": "2020-12-30T07:19:59.846Z",
                "updated_at": "2020-12-30T07:19:59.978Z"
            },
            {
                "id": 1497,
                "name": "product-5-4.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-4.jpg",
                        "hash": "thumbnail_product_5_4_1ac3e542b3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.8,
                        "url": "/uploads/thumbnail_product_5_4_1ac3e542b3.jpg"
                    },
                    "large": {
                        "name": "large_product-5-4.jpg",
                        "hash": "large_product_5_4_1ac3e542b3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 73.72,
                        "url": "/uploads/large_product_5_4_1ac3e542b3.jpg"
                    },
                    "medium": {
                        "name": "medium_product-5-4.jpg",
                        "hash": "medium_product_5_4_1ac3e542b3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 46.13,
                        "url": "/uploads/medium_product_5_4_1ac3e542b3.jpg"
                    },
                    "small": {
                        "name": "small_product-5-4.jpg",
                        "hash": "small_product_5_4_1ac3e542b3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 22.52,
                        "url": "/uploads/small_product_5_4_1ac3e542b3.jpg"
                    }
                },
                "hash": "product_5_4_1ac3e542b3",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 75.28,
                "url": "/uploads/product_5_4_1ac3e542b3.jpg",
                "created_at": "2020-12-30T07:19:59.826Z",
                "updated_at": "2020-12-30T07:19:59.942Z"
            },
            {
                "id": 1496,
                "name": "product-5-1.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-1.jpg",
                        "hash": "thumbnail_product_5_1_b6fccd3735",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.83,
                        "url": "/uploads/thumbnail_product_5_1_b6fccd3735.jpg"
                    },
                    "large": {
                        "name": "large_product-5-1.jpg",
                        "hash": "large_product_5_1_b6fccd3735",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 66.18,
                        "url": "/uploads/large_product_5_1_b6fccd3735.jpg"
                    },
                    "medium": {
                        "name": "medium_product-5-1.jpg",
                        "hash": "medium_product_5_1_b6fccd3735",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 42.7,
                        "url": "/uploads/medium_product_5_1_b6fccd3735.jpg"
                    },
                    "small": {
                        "name": "small_product-5-1.jpg",
                        "hash": "small_product_5_1_b6fccd3735",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 21.81,
                        "url": "/uploads/small_product_5_1_b6fccd3735.jpg"
                    }
                },
                "hash": "product_5_1_b6fccd3735",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 66.06,
                "url": "/uploads/product_5_1_b6fccd3735.jpg",
                "created_at": "2020-12-30T07:19:59.790Z",
                "updated_at": "2020-12-30T07:19:59.907Z"
            },
            {
                "id": 1499,
                "name": "product-5-3.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-3.jpg",
                        "hash": "thumbnail_product_5_3_b58c599287",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.73,
                        "url": "/uploads/thumbnail_product_5_3_b58c599287.jpg"
                    },
                    "large": {
                        "name": "large_product-5-3.jpg",
                        "hash": "large_product_5_3_b58c599287",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 96.42,
                        "url": "/uploads/large_product_5_3_b58c599287.jpg"
                    },
                    "medium": {
                        "name": "medium_product-5-3.jpg",
                        "hash": "medium_product_5_3_b58c599287",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 53.24,
                        "url": "/uploads/medium_product_5_3_b58c599287.jpg"
                    },
                    "small": {
                        "name": "small_product-5-3.jpg",
                        "hash": "small_product_5_3_b58c599287",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 24.34,
                        "url": "/uploads/small_product_5_3_b58c599287.jpg"
                    }
                },
                "hash": "product_5_3_b58c599287",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 105.14,
                "url": "/uploads/product_5_3_b58c599287.jpg",
                "created_at": "2020-12-30T07:19:59.867Z",
                "updated_at": "2020-12-30T07:20:00.014Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 1501,
                "name": "product-5-2-300x190.jpg",
                "caption": "",
                "width": 300,
                "height": 327,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-2-300x190.jpg",
                        "hash": "thumbnail_product_5_2_300x190_7ec8c0ecc8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 143,
                        "height": 156,
                        "size": 2.62,
                        "url": "/uploads/thumbnail_product_5_2_300x190_7ec8c0ecc8.jpg"
                    }
                },
                "hash": "product_5_2_300x190_7ec8c0ecc8",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 7.6,
                "url": "/uploads/product_5_2_300x190_7ec8c0ecc8.jpg",
                "created_at": "2020-12-30T07:21:18.987Z",
                "updated_at": "2020-12-30T07:21:19.097Z"
            },
            {
                "id": 1503,
                "name": "product-5-4-300x190.jpg",
                "caption": "",
                "width": 300,
                "height": 340,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-4-300x190.jpg",
                        "hash": "thumbnail_product_5_4_300x190_ae766268aa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 138,
                        "height": 156,
                        "size": 4,
                        "url": "/uploads/thumbnail_product_5_4_300x190_ae766268aa.jpg"
                    }
                },
                "hash": "product_5_4_300x190_ae766268aa",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 13.1,
                "url": "/uploads/product_5_4_300x190_ae766268aa.jpg",
                "created_at": "2020-12-30T07:21:19.030Z",
                "updated_at": "2020-12-30T07:21:19.159Z"
            },
            {
                "id": 1500,
                "name": "product-5-1-300x190.jpg",
                "caption": "",
                "width": 300,
                "height": 190,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-1-300x190.jpg",
                        "hash": "thumbnail_product_5_1_300x190_787440f117",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 245,
                        "height": 155,
                        "size": 5.46,
                        "url": "/uploads/thumbnail_product_5_1_300x190_787440f117.jpg"
                    }
                },
                "hash": "product_5_1_300x190_787440f117",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 7.35,
                "url": "/uploads/product_5_1_300x190_787440f117.jpg",
                "created_at": "2020-12-30T07:21:18.954Z",
                "updated_at": "2020-12-30T07:21:19.062Z"
            },
            {
                "id": 1502,
                "name": "product-5-3-300x190.jpg",
                "caption": "",
                "width": 300,
                "height": 227,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-3-300x190.jpg",
                        "hash": "thumbnail_product_5_3_300x190_69a7d7e0db",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 206,
                        "height": 156,
                        "size": 5.42,
                        "url": "/uploads/thumbnail_product_5_3_300x190_69a7d7e0db.jpg"
                    }
                },
                "hash": "product_5_3_300x190_69a7d7e0db",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.33,
                "url": "/uploads/product_5_3_300x190_69a7d7e0db.jpg",
                "created_at": "2020-12-30T07:21:19.010Z",
                "updated_at": "2020-12-30T07:21:19.128Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 91,
        "name": "Black faux leather chain trim sandals",
        "slug": "black-faux-leather-chain-trim-sandals",
        "short_desc": "This is sample of long description. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 90,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T06:11:22.865Z",
        "updated_at": "2021-01-11T04:25:33.263Z",
        "pictures": [
            {
                "id": 1655,
                "name": "5-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_5-big.jpg",
                        "hash": "thumbnail_5_big_dff8095b6d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.58,
                        "url": "/uploads/thumbnail_5_big_dff8095b6d.jpg"
                    },
                    "large": {
                        "name": "large_5-big.jpg",
                        "hash": "large_5_big_dff8095b6d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 60.24,
                        "url": "/uploads/large_5_big_dff8095b6d.jpg"
                    },
                    "medium": {
                        "name": "medium_5-big.jpg",
                        "hash": "medium_5_big_dff8095b6d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 37.02,
                        "url": "/uploads/medium_5_big_dff8095b6d.jpg"
                    },
                    "small": {
                        "name": "small_5-big.jpg",
                        "hash": "small_5_big_dff8095b6d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 17.41,
                        "url": "/uploads/small_5_big_dff8095b6d.jpg"
                    }
                },
                "hash": "5_big_dff8095b6d",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 70.27,
                "url": "/uploads/5_big_dff8095b6d.jpg",
                "created_at": "2021-01-07T02:02:33.756Z",
                "updated_at": "2021-01-07T02:02:33.862Z"
            },
            {
                "id": 1657,
                "name": "6-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_6-big.jpg",
                        "hash": "thumbnail_6_big_3a529e5c3c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.3,
                        "url": "/uploads/thumbnail_6_big_3a529e5c3c.jpg"
                    },
                    "large": {
                        "name": "large_6-big.jpg",
                        "hash": "large_6_big_3a529e5c3c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 53.77,
                        "url": "/uploads/large_6_big_3a529e5c3c.jpg"
                    },
                    "medium": {
                        "name": "medium_6-big.jpg",
                        "hash": "medium_6_big_3a529e5c3c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 32.62,
                        "url": "/uploads/medium_6_big_3a529e5c3c.jpg"
                    },
                    "small": {
                        "name": "small_6-big.jpg",
                        "hash": "small_6_big_3a529e5c3c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 15.18,
                        "url": "/uploads/small_6_big_3a529e5c3c.jpg"
                    }
                },
                "hash": "6_big_3a529e5c3c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 58.02,
                "url": "/uploads/6_big_3a529e5c3c.jpg",
                "created_at": "2021-01-07T02:02:33.801Z",
                "updated_at": "2021-01-07T02:02:33.929Z"
            },
            {
                "id": 1656,
                "name": "7-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_7-big.jpg",
                        "hash": "thumbnail_7_big_037aa72fde",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.25,
                        "url": "/uploads/thumbnail_7_big_037aa72fde.jpg"
                    },
                    "large": {
                        "name": "large_7-big.jpg",
                        "hash": "large_7_big_037aa72fde",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 56.17,
                        "url": "/uploads/large_7_big_037aa72fde.jpg"
                    },
                    "medium": {
                        "name": "medium_7-big.jpg",
                        "hash": "medium_7_big_037aa72fde",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 36.8,
                        "url": "/uploads/medium_7_big_037aa72fde.jpg"
                    },
                    "small": {
                        "name": "small_7-big.jpg",
                        "hash": "small_7_big_037aa72fde",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 19.15,
                        "url": "/uploads/small_7_big_037aa72fde.jpg"
                    }
                },
                "hash": "7_big_037aa72fde",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 60.83,
                "url": "/uploads/7_big_037aa72fde.jpg",
                "created_at": "2021-01-07T02:02:33.782Z",
                "updated_at": "2021-01-07T02:02:33.894Z"
            },
            {
                "id": 1658,
                "name": "8-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_8-big.jpg",
                        "hash": "thumbnail_8_big_3e07e623e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.05,
                        "url": "/uploads/thumbnail_8_big_3e07e623e2.jpg"
                    },
                    "large": {
                        "name": "large_8-big.jpg",
                        "hash": "large_8_big_3e07e623e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 49.84,
                        "url": "/uploads/large_8_big_3e07e623e2.jpg"
                    },
                    "medium": {
                        "name": "medium_8-big.jpg",
                        "hash": "medium_8_big_3e07e623e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 29.54,
                        "url": "/uploads/medium_8_big_3e07e623e2.jpg"
                    },
                    "small": {
                        "name": "small_8-big.jpg",
                        "hash": "small_8_big_3e07e623e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 13.53,
                        "url": "/uploads/small_8_big_3e07e623e2.jpg"
                    }
                },
                "hash": "8_big_3e07e623e2",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 52.52,
                "url": "/uploads/8_big_3e07e623e2.jpg",
                "created_at": "2021-01-07T02:02:33.821Z",
                "updated_at": "2021-01-07T02:02:33.963Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 1651,
                "name": "5.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_5.jpg",
                        "hash": "thumbnail_5_12a3f8d877",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.66,
                        "url": "/uploads/thumbnail_5_12a3f8d877.jpg"
                    }
                },
                "hash": "5_12a3f8d877",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 12.91,
                "url": "/uploads/5_12a3f8d877.jpg",
                "created_at": "2021-01-07T02:02:09.430Z",
                "updated_at": "2021-01-07T02:02:09.490Z"
            },
            {
                "id": 1652,
                "name": "6.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_6.jpg",
                        "hash": "thumbnail_6_6d9a6a354b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.33,
                        "url": "/uploads/thumbnail_6_6d9a6a354b.jpg"
                    }
                },
                "hash": "6_6d9a6a354b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.91,
                "url": "/uploads/6_6d9a6a354b.jpg",
                "created_at": "2021-01-07T02:02:09.464Z",
                "updated_at": "2021-01-07T02:02:09.562Z"
            },
            {
                "id": 1654,
                "name": "7.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_7.jpg",
                        "hash": "thumbnail_7_0ec91a9581",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.25,
                        "url": "/uploads/thumbnail_7_0ec91a9581.jpg"
                    }
                },
                "hash": "7_0ec91a9581",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 13.11,
                "url": "/uploads/7_0ec91a9581.jpg",
                "created_at": "2021-01-07T02:02:09.529Z",
                "updated_at": "2021-01-07T02:02:09.615Z"
            },
            {
                "id": 1653,
                "name": "8.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_8.jpg",
                        "hash": "thumbnail_8_6919a9ac7f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.03,
                        "url": "/uploads/thumbnail_8_6919a9ac7f.jpg"
                    }
                },
                "hash": "8_6919a9ac7f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 8.42,
                "url": "/uploads/8_6919a9ac7f.jpg",
                "created_at": "2021-01-07T02:02:09.508Z",
                "updated_at": "2021-01-07T02:02:09.587Z"
            }
        ],
        "category": [
            {
                "id": 31,
                "name": "Boots",
                "slug": "boots",
                "created_at": "2020-12-24T03:57:07.882Z",
                "updated_at": "2020-12-24T03:57:07.915Z"
            },
            {
                "id": 3,
                "name": "Shoes",
                "slug": "shoes",
                "created_at": "2020-03-14T10:25:39.408Z",
                "updated_at": "2020-12-24T01:57:14.431Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 92,
        "name": "Brown faux fur longline coat",
        "slug": "brown-faux-fur-longline-coat",
        "short_desc": "This is a sample of long description. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 310,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T06:13:37.933Z",
        "updated_at": "2021-01-15T00:45:37.534Z",
        "pictures": [
            {
                "id": 582,
                "name": "product-3-1.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-1.jpg",
                        "hash": "thumbnail_product_3_1_a735544125",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.28,
                        "url": "/uploads/thumbnail_product_3_1_a735544125.jpg"
                    },
                    "medium": {
                        "name": "medium_product-3-1.jpg",
                        "hash": "medium_product_3_1_a735544125",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 60.52,
                        "url": "/uploads/medium_product_3_1_a735544125.jpg"
                    },
                    "small": {
                        "name": "small_product-3-1.jpg",
                        "hash": "small_product_3_1_a735544125",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 30.12,
                        "url": "/uploads/small_product_3_1_a735544125.jpg"
                    }
                },
                "hash": "product_3_1_a735544125",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 60.87,
                "url": "/uploads/product_3_1_a735544125.jpg",
                "created_at": "2020-12-24T06:12:04.834Z",
                "updated_at": "2020-12-24T06:12:04.975Z"
            },
            {
                "id": 583,
                "name": "product-3-2.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-2.jpg",
                        "hash": "thumbnail_product_3_2_c4da51a5e5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.71,
                        "url": "/uploads/thumbnail_product_3_2_c4da51a5e5.jpg"
                    },
                    "medium": {
                        "name": "medium_product-3-2.jpg",
                        "hash": "medium_product_3_2_c4da51a5e5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 63.99,
                        "url": "/uploads/medium_product_3_2_c4da51a5e5.jpg"
                    },
                    "small": {
                        "name": "small_product-3-2.jpg",
                        "hash": "small_product_3_2_c4da51a5e5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 28.69,
                        "url": "/uploads/small_product_3_2_c4da51a5e5.jpg"
                    }
                },
                "hash": "product_3_2_c4da51a5e5",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 68.63,
                "url": "/uploads/product_3_2_c4da51a5e5.jpg",
                "created_at": "2020-12-24T06:12:04.890Z",
                "updated_at": "2020-12-24T06:12:05.011Z"
            },
            {
                "id": 584,
                "name": "product-3-3.jpg",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-3.jpg",
                        "hash": "thumbnail_product_3_3_316435d125",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 5.45,
                        "url": "/uploads/thumbnail_product_3_3_316435d125.jpg"
                    },
                    "medium": {
                        "name": "medium_product-3-3.jpg",
                        "hash": "medium_product_3_3_316435d125",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 98.12,
                        "url": "/uploads/medium_product_3_3_316435d125.jpg"
                    },
                    "small": {
                        "name": "small_product-3-3.jpg",
                        "hash": "small_product_3_3_316435d125",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 46.08,
                        "url": "/uploads/small_product_3_3_316435d125.jpg"
                    }
                },
                "hash": "product_3_3_316435d125",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 106.31,
                "url": "/uploads/product_3_3_316435d125.jpg",
                "created_at": "2020-12-24T06:12:04.912Z",
                "updated_at": "2020-12-24T06:12:05.050Z"
            },
            {
                "id": 585,
                "name": "product-3-4.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-4.jpg",
                        "hash": "thumbnail_product_3_4_66f6b1e5b8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.65,
                        "url": "/uploads/thumbnail_product_3_4_66f6b1e5b8.jpg"
                    },
                    "large": {
                        "name": "large_product-3-4.jpg",
                        "hash": "large_product_3_4_66f6b1e5b8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 60.22,
                        "url": "/uploads/large_product_3_4_66f6b1e5b8.jpg"
                    },
                    "medium": {
                        "name": "medium_product-3-4.jpg",
                        "hash": "medium_product_3_4_66f6b1e5b8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 38.02,
                        "url": "/uploads/medium_product_3_4_66f6b1e5b8.jpg"
                    },
                    "small": {
                        "name": "small_product-3-4.jpg",
                        "hash": "small_product_3_4_66f6b1e5b8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 19.4,
                        "url": "/uploads/small_product_3_4_66f6b1e5b8.jpg"
                    }
                },
                "hash": "product_3_4_66f6b1e5b8",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 69.04,
                "url": "/uploads/product_3_4_66f6b1e5b8.jpg",
                "created_at": "2020-12-24T06:12:04.936Z",
                "updated_at": "2020-12-24T06:12:05.087Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 586,
                "name": "product-3-1-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-1-300x300.jpg",
                        "hash": "thumbnail_product_3_1_300x300_c1c27f2eac",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.33,
                        "url": "/uploads/thumbnail_product_3_1_300x300_c1c27f2eac.jpg"
                    }
                },
                "hash": "product_3_1_300x300_c1c27f2eac",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 12.11,
                "url": "/uploads/product_3_1_300x300_c1c27f2eac.jpg",
                "created_at": "2020-12-24T06:12:22.902Z",
                "updated_at": "2020-12-24T06:12:23.012Z"
            },
            {
                "id": 587,
                "name": "product-3-2-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-2-300x300.jpg",
                        "hash": "thumbnail_product_3_2_300x300_ce25066f39",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.79,
                        "url": "/uploads/thumbnail_product_3_2_300x300_ce25066f39.jpg"
                    }
                },
                "hash": "product_3_2_300x300_ce25066f39",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 10.81,
                "url": "/uploads/product_3_2_300x300_ce25066f39.jpg",
                "created_at": "2020-12-24T06:12:22.927Z",
                "updated_at": "2020-12-24T06:12:23.048Z"
            },
            {
                "id": 588,
                "name": "product-3-3-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-3-300x300.jpg",
                        "hash": "thumbnail_product_3_3_300x300_7a52a367d8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 5.53,
                        "url": "/uploads/thumbnail_product_3_3_300x300_7a52a367d8.jpg"
                    }
                },
                "hash": "product_3_3_300x300_7a52a367d8",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 17.31,
                "url": "/uploads/product_3_3_300x300_7a52a367d8.jpg",
                "created_at": "2020-12-24T06:12:22.949Z",
                "updated_at": "2020-12-24T06:12:23.093Z"
            },
            {
                "id": 589,
                "name": "product-3-4-300x300.jpg",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-4-300x300.jpg",
                        "hash": "thumbnail_product_3_4_300x300_da5b300369",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.69,
                        "url": "/uploads/thumbnail_product_3_4_300x300_da5b300369.jpg"
                    }
                },
                "hash": "product_3_4_300x300_da5b300369",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.39,
                "url": "/uploads/product_3_4_300x300_da5b300369.jpg",
                "created_at": "2020-12-24T06:12:22.973Z",
                "updated_at": "2020-12-24T06:12:23.124Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 93,
        "name": "Dark yellow lace cut out swing dress",
        "slug": "dark-yellow-lace-cut-out-swing-dress",
        "short_desc": "This is a sample of short description.",
        "price": 84,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T08:20:25.219Z",
        "updated_at": "2021-01-11T04:25:43.380Z",
        "pictures": [
            {
                "id": 1638,
                "name": "1-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1-big.jpg",
                        "hash": "thumbnail_1_big_f3d14c6d9e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 5.85,
                        "url": "/uploads/thumbnail_1_big_f3d14c6d9e.jpg"
                    },
                    "large": {
                        "name": "large_1-big.jpg",
                        "hash": "large_1_big_f3d14c6d9e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 178.13,
                        "url": "/uploads/large_1_big_f3d14c6d9e.jpg"
                    },
                    "medium": {
                        "name": "medium_1-big.jpg",
                        "hash": "medium_1_big_f3d14c6d9e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 103.41,
                        "url": "/uploads/medium_1_big_f3d14c6d9e.jpg"
                    },
                    "small": {
                        "name": "small_1-big.jpg",
                        "hash": "small_1_big_f3d14c6d9e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 46.17,
                        "url": "/uploads/small_1_big_f3d14c6d9e.jpg"
                    }
                },
                "hash": "1_big_f3d14c6d9e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 225.75,
                "url": "/uploads/1_big_f3d14c6d9e.jpg",
                "created_at": "2021-01-07T00:41:29.869Z",
                "updated_at": "2021-01-07T00:41:30.024Z"
            },
            {
                "id": 1635,
                "name": "2-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-big.jpg",
                        "hash": "thumbnail_2_big_b92bad0d29",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.05,
                        "url": "/uploads/thumbnail_2_big_b92bad0d29.jpg"
                    },
                    "large": {
                        "name": "large_2-big.jpg",
                        "hash": "large_2_big_b92bad0d29",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 92.46,
                        "url": "/uploads/large_2_big_b92bad0d29.jpg"
                    },
                    "medium": {
                        "name": "medium_2-big.jpg",
                        "hash": "medium_2_big_b92bad0d29",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 56.58,
                        "url": "/uploads/medium_2_big_b92bad0d29.jpg"
                    },
                    "small": {
                        "name": "small_2-big.jpg",
                        "hash": "small_2_big_b92bad0d29",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 26.67,
                        "url": "/uploads/small_2_big_b92bad0d29.jpg"
                    }
                },
                "hash": "2_big_b92bad0d29",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 110.6,
                "url": "/uploads/2_big_b92bad0d29.jpg",
                "created_at": "2021-01-07T00:41:29.804Z",
                "updated_at": "2021-01-07T00:41:29.908Z"
            },
            {
                "id": 1636,
                "name": "3-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3-big.jpg",
                        "hash": "thumbnail_3_big_a6689a6840",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.29,
                        "url": "/uploads/thumbnail_3_big_a6689a6840.jpg"
                    },
                    "large": {
                        "name": "large_3-big.jpg",
                        "hash": "large_3_big_a6689a6840",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 67.36,
                        "url": "/uploads/large_3_big_a6689a6840.jpg"
                    },
                    "medium": {
                        "name": "medium_3-big.jpg",
                        "hash": "medium_3_big_a6689a6840",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 42.46,
                        "url": "/uploads/medium_3_big_a6689a6840.jpg"
                    },
                    "small": {
                        "name": "small_3-big.jpg",
                        "hash": "small_3_big_a6689a6840",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 20.91,
                        "url": "/uploads/small_3_big_a6689a6840.jpg"
                    }
                },
                "hash": "3_big_a6689a6840",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 81.53,
                "url": "/uploads/3_big_a6689a6840.jpg",
                "created_at": "2021-01-07T00:41:29.832Z",
                "updated_at": "2021-01-07T00:41:29.939Z"
            },
            {
                "id": 1637,
                "name": "4-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_4-big.jpg",
                        "hash": "thumbnail_4_big_33487c57fa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.03,
                        "url": "/uploads/thumbnail_4_big_33487c57fa.jpg"
                    },
                    "large": {
                        "name": "large_4-big.jpg",
                        "hash": "large_4_big_33487c57fa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 94.65,
                        "url": "/uploads/large_4_big_33487c57fa.jpg"
                    },
                    "medium": {
                        "name": "medium_4-big.jpg",
                        "hash": "medium_4_big_33487c57fa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 58.2,
                        "url": "/uploads/medium_4_big_33487c57fa.jpg"
                    },
                    "small": {
                        "name": "small_4-big.jpg",
                        "hash": "small_4_big_33487c57fa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 26.88,
                        "url": "/uploads/small_4_big_33487c57fa.jpg"
                    }
                },
                "hash": "4_big_33487c57fa",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 117.57,
                "url": "/uploads/4_big_33487c57fa.jpg",
                "created_at": "2021-01-07T00:41:29.850Z",
                "updated_at": "2021-01-07T00:41:29.988Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 1642,
                "name": "1.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1.jpg",
                        "hash": "thumbnail_1_aa85a47653",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 6.03,
                        "url": "/uploads/thumbnail_1_aa85a47653.jpg"
                    }
                },
                "hash": "1_aa85a47653",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 47.72,
                "url": "/uploads/1_aa85a47653.jpg",
                "created_at": "2021-01-07T00:41:45.892Z",
                "updated_at": "2021-01-07T00:41:46.046Z"
            },
            {
                "id": 1639,
                "name": "2.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2.jpg",
                        "hash": "thumbnail_2_5f037f660b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.16,
                        "url": "/uploads/thumbnail_2_5f037f660b.jpg"
                    }
                },
                "hash": "2_5f037f660b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 21.59,
                "url": "/uploads/2_5f037f660b.jpg",
                "created_at": "2021-01-07T00:41:45.822Z",
                "updated_at": "2021-01-07T00:41:45.933Z"
            },
            {
                "id": 1641,
                "name": "3.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3.jpg",
                        "hash": "thumbnail_3_e34b30cfd8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.35,
                        "url": "/uploads/thumbnail_3_e34b30cfd8.jpg"
                    }
                },
                "hash": "3_e34b30cfd8",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 16.25,
                "url": "/uploads/3_e34b30cfd8.jpg",
                "created_at": "2021-01-07T00:41:45.868Z",
                "updated_at": "2021-01-07T00:41:46.009Z"
            },
            {
                "id": 1640,
                "name": "4.jpg",
                "caption": "",
                "width": 458,
                "height": 458,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_4.jpg",
                        "hash": "thumbnail_4_3331bcfb46",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 4.15,
                        "url": "/uploads/thumbnail_4_3331bcfb46.jpg"
                    }
                },
                "hash": "4_3331bcfb46",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 24.01,
                "url": "/uploads/4_3331bcfb46.jpg",
                "created_at": "2021-01-07T00:41:45.846Z",
                "updated_at": "2021-01-07T00:41:45.969Z"
            }
        ],
        "category": [
            {
                "id": 4,
                "name": "Dresses",
                "slug": "dresses",
                "created_at": "2020-03-14T10:25:51.376Z",
                "updated_at": "2020-12-24T01:57:33.935Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            },
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            }
        ]
    },
    {
        "id": 94,
        "name": "Yellow tie strap block heel sandals",
        "slug": "yellow-tie-strap-block-heel-sandals",
        "short_desc": "This is a sample of short description.",
        "price": 68,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T08:26:03.691Z",
        "updated_at": "2021-01-11T04:25:48.590Z",
        "pictures": [
            {
                "id": 598,
                "name": "1-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1-big.jpg",
                        "hash": "thumbnail_1_big_3f53ed3f1c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.48,
                        "url": "/uploads/thumbnail_1_big_3f53ed3f1c.jpg"
                    },
                    "large": {
                        "name": "large_1-big.jpg",
                        "hash": "large_1_big_3f53ed3f1c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 55.44,
                        "url": "/uploads/large_1_big_3f53ed3f1c.jpg"
                    },
                    "medium": {
                        "name": "medium_1-big.jpg",
                        "hash": "medium_1_big_3f53ed3f1c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 31.8,
                        "url": "/uploads/medium_1_big_3f53ed3f1c.jpg"
                    },
                    "small": {
                        "name": "small_1-big.jpg",
                        "hash": "small_1_big_3f53ed3f1c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 14.55,
                        "url": "/uploads/small_1_big_3f53ed3f1c.jpg"
                    }
                },
                "hash": "1_big_3f53ed3f1c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 69.5,
                "url": "/uploads/1_big_3f53ed3f1c.jpg",
                "created_at": "2020-12-24T08:20:55.304Z",
                "updated_at": "2020-12-24T08:20:55.419Z"
            },
            {
                "id": 600,
                "name": "2-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-big.jpg",
                        "hash": "thumbnail_2_big_e62a3af309",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.44,
                        "url": "/uploads/thumbnail_2_big_e62a3af309.jpg"
                    },
                    "large": {
                        "name": "large_2-big.jpg",
                        "hash": "large_2_big_e62a3af309",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 69.42,
                        "url": "/uploads/large_2_big_e62a3af309.jpg"
                    },
                    "medium": {
                        "name": "medium_2-big.jpg",
                        "hash": "medium_2_big_e62a3af309",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 37.44,
                        "url": "/uploads/medium_2_big_e62a3af309.jpg"
                    },
                    "small": {
                        "name": "small_2-big.jpg",
                        "hash": "small_2_big_e62a3af309",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 16.14,
                        "url": "/uploads/small_2_big_e62a3af309.jpg"
                    }
                },
                "hash": "2_big_e62a3af309",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 78.55,
                "url": "/uploads/2_big_e62a3af309.jpg",
                "created_at": "2020-12-24T08:20:55.353Z",
                "updated_at": "2020-12-24T08:20:55.492Z"
            },
            {
                "id": 601,
                "name": "3-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3-big.jpg",
                        "hash": "thumbnail_3_big_b85715002c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.81,
                        "url": "/uploads/thumbnail_3_big_b85715002c.jpg"
                    },
                    "large": {
                        "name": "large_3-big.jpg",
                        "hash": "large_3_big_b85715002c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 117.47,
                        "url": "/uploads/large_3_big_b85715002c.jpg"
                    },
                    "medium": {
                        "name": "medium_3-big.jpg",
                        "hash": "medium_3_big_b85715002c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 66.83,
                        "url": "/uploads/medium_3_big_b85715002c.jpg"
                    },
                    "small": {
                        "name": "small_3-big.jpg",
                        "hash": "small_3_big_b85715002c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 29.04,
                        "url": "/uploads/small_3_big_b85715002c.jpg"
                    }
                },
                "hash": "3_big_b85715002c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 152.88,
                "url": "/uploads/3_big_b85715002c.jpg",
                "created_at": "2020-12-24T08:20:55.375Z",
                "updated_at": "2020-12-24T08:20:55.530Z"
            },
            {
                "id": 599,
                "name": "4-big.jpg",
                "caption": "",
                "width": 1200,
                "height": 1200,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_4-big.jpg",
                        "hash": "thumbnail_4_big_806ac0c831",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.07,
                        "url": "/uploads/thumbnail_4_big_806ac0c831.jpg"
                    },
                    "large": {
                        "name": "large_4-big.jpg",
                        "hash": "large_4_big_806ac0c831",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 1000,
                        "height": 1000,
                        "size": 43.7,
                        "url": "/uploads/large_4_big_806ac0c831.jpg"
                    },
                    "medium": {
                        "name": "medium_4-big.jpg",
                        "hash": "medium_4_big_806ac0c831",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 25.52,
                        "url": "/uploads/medium_4_big_806ac0c831.jpg"
                    },
                    "small": {
                        "name": "small_4-big.jpg",
                        "hash": "small_4_big_806ac0c831",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 12,
                        "url": "/uploads/small_4_big_806ac0c831.jpg"
                    }
                },
                "hash": "4_big_806ac0c831",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 54.46,
                "url": "/uploads/4_big_806ac0c831.jpg",
                "created_at": "2020-12-24T08:20:55.330Z",
                "updated_at": "2020-12-24T08:20:55.452Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 602,
                "name": "1.jpg",
                "caption": "",
                "width": 575,
                "height": 575,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1.jpg",
                        "hash": "thumbnail_1_f8b683bd38",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.5,
                        "url": "/uploads/thumbnail_1_f8b683bd38.jpg"
                    },
                    "small": {
                        "name": "small_1.jpg",
                        "hash": "small_1_f8b683bd38",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 13.9,
                        "url": "/uploads/small_1_f8b683bd38.jpg"
                    }
                },
                "hash": "1_f8b683bd38",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 14.81,
                "url": "/uploads/1_f8b683bd38.jpg",
                "created_at": "2020-12-24T08:21:06.947Z",
                "updated_at": "2020-12-24T08:21:07.067Z"
            },
            {
                "id": 603,
                "name": "2.jpg",
                "caption": "",
                "width": 575,
                "height": 575,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2.jpg",
                        "hash": "thumbnail_2_c5b26b1154",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.45,
                        "url": "/uploads/thumbnail_2_c5b26b1154.jpg"
                    },
                    "small": {
                        "name": "small_2.jpg",
                        "hash": "small_2_c5b26b1154",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 16.5,
                        "url": "/uploads/small_2_c5b26b1154.jpg"
                    }
                },
                "hash": "2_c5b26b1154",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 20.81,
                "url": "/uploads/2_c5b26b1154.jpg",
                "created_at": "2020-12-24T08:21:06.977Z",
                "updated_at": "2020-12-24T08:21:07.111Z"
            },
            {
                "id": 605,
                "name": "3.jpg",
                "caption": "",
                "width": 575,
                "height": 575,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3.jpg",
                        "hash": "thumbnail_3_7f384e534d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.86,
                        "url": "/uploads/thumbnail_3_7f384e534d.jpg"
                    },
                    "small": {
                        "name": "small_3.jpg",
                        "hash": "small_3_7f384e534d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 28.45,
                        "url": "/uploads/small_3_7f384e534d.jpg"
                    }
                },
                "hash": "3_7f384e534d",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 33.8,
                "url": "/uploads/3_7f384e534d.jpg",
                "created_at": "2020-12-24T08:21:07.022Z",
                "updated_at": "2020-12-24T08:21:07.189Z"
            },
            {
                "id": 604,
                "name": "4.jpg",
                "caption": "",
                "width": 575,
                "height": 575,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_4.jpg",
                        "hash": "thumbnail_4_51dfbbc880",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.12,
                        "url": "/uploads/thumbnail_4_51dfbbc880.jpg"
                    },
                    "small": {
                        "name": "small_4.jpg",
                        "hash": "small_4_51dfbbc880",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 11.8,
                        "url": "/uploads/small_4_51dfbbc880.jpg"
                    }
                },
                "hash": "4_51dfbbc880",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.66,
                "url": "/uploads/4_51dfbbc880.jpg",
                "created_at": "2020-12-24T08:21:07.000Z",
                "updated_at": "2020-12-24T08:21:07.148Z"
            }
        ],
        "category": [
            {
                "id": 3,
                "name": "Shoes",
                "slug": "shoes",
                "created_at": "2020-03-14T10:25:39.408Z",
                "updated_at": "2020-12-24T01:57:14.431Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 95,
        "name": "Loafers",
        "slug": "loafers",
        "short_desc": "This is a sample of long description. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 67,
        "stock": 103,
        "new": true,
        "created_at": "2020-12-24T08:42:07.142Z",
        "updated_at": "2021-01-25T13:21:40.548Z",
        "pictures": [
            {
                "id": 606,
                "name": "1-big.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1-big.jpg",
                        "hash": "thumbnail_1_big_7540f08de7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.18,
                        "url": "/uploads/thumbnail_1_big_7540f08de7.jpg"
                    },
                    "large": {
                        "name": "large_1-big.jpg",
                        "hash": "large_1_big_7540f08de7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 44.18,
                        "url": "/uploads/large_1_big_7540f08de7.jpg"
                    },
                    "medium": {
                        "name": "medium_1-big.jpg",
                        "hash": "medium_1_big_7540f08de7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 26.57,
                        "url": "/uploads/medium_1_big_7540f08de7.jpg"
                    },
                    "small": {
                        "name": "small_1-big.jpg",
                        "hash": "small_1_big_7540f08de7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 13.1,
                        "url": "/uploads/small_1_big_7540f08de7.jpg"
                    }
                },
                "hash": "1_big_7540f08de7",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 39.95,
                "url": "/uploads/1_big_7540f08de7.jpg",
                "created_at": "2020-12-24T08:40:38.041Z",
                "updated_at": "2020-12-24T08:40:38.140Z"
            },
            {
                "id": 607,
                "name": "2-big.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-big.jpg",
                        "hash": "thumbnail_2_big_f23fcb5d30",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 1.36,
                        "url": "/uploads/thumbnail_2_big_f23fcb5d30.jpg"
                    },
                    "large": {
                        "name": "large_2-big.jpg",
                        "hash": "large_2_big_f23fcb5d30",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 26.54,
                        "url": "/uploads/large_2_big_f23fcb5d30.jpg"
                    },
                    "medium": {
                        "name": "medium_2-big.jpg",
                        "hash": "medium_2_big_f23fcb5d30",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 15.83,
                        "url": "/uploads/medium_2_big_f23fcb5d30.jpg"
                    },
                    "small": {
                        "name": "small_2-big.jpg",
                        "hash": "small_2_big_f23fcb5d30",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 7.53,
                        "url": "/uploads/small_2_big_f23fcb5d30.jpg"
                    }
                },
                "hash": "2_big_f23fcb5d30",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 25.21,
                "url": "/uploads/2_big_f23fcb5d30.jpg",
                "created_at": "2020-12-24T08:40:38.071Z",
                "updated_at": "2020-12-24T08:40:38.173Z"
            },
            {
                "id": 608,
                "name": "3-big.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3-big.jpg",
                        "hash": "thumbnail_3_big_898d71e39e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.66,
                        "url": "/uploads/thumbnail_3_big_898d71e39e.jpg"
                    },
                    "large": {
                        "name": "large_3-big.jpg",
                        "hash": "large_3_big_898d71e39e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 159.47,
                        "url": "/uploads/large_3_big_898d71e39e.jpg"
                    },
                    "medium": {
                        "name": "medium_3-big.jpg",
                        "hash": "medium_3_big_898d71e39e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 95.58,
                        "url": "/uploads/medium_3_big_898d71e39e.jpg"
                    },
                    "small": {
                        "name": "small_3-big.jpg",
                        "hash": "small_3_big_898d71e39e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 40.58,
                        "url": "/uploads/small_3_big_898d71e39e.jpg"
                    }
                },
                "hash": "3_big_898d71e39e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 148.5,
                "url": "/uploads/3_big_898d71e39e.jpg",
                "created_at": "2020-12-24T08:40:38.092Z",
                "updated_at": "2020-12-24T08:40:38.209Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 609,
                "name": "1.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_1.jpg",
                        "hash": "thumbnail_1_90856a8f53",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.17,
                        "url": "/uploads/thumbnail_1_90856a8f53.jpg"
                    }
                },
                "hash": "1_90856a8f53",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.13,
                "url": "/uploads/1_90856a8f53.jpg",
                "created_at": "2020-12-24T08:40:51.421Z",
                "updated_at": "2020-12-24T08:40:51.456Z"
            },
            {
                "id": 610,
                "name": "2.jpg",
                "caption": "",
                "width": 600,
                "height": 816,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2.jpg",
                        "hash": "thumbnail_2_4d45fbbc96",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 1.37,
                        "url": "/uploads/thumbnail_2_4d45fbbc96.jpg"
                    },
                    "medium": {
                        "name": "medium_2.jpg",
                        "hash": "medium_2_4d45fbbc96",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 15.65,
                        "url": "/uploads/medium_2_4d45fbbc96.jpg"
                    },
                    "small": {
                        "name": "small_2.jpg",
                        "hash": "small_2_4d45fbbc96",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 7.75,
                        "url": "/uploads/small_2_4d45fbbc96.jpg"
                    }
                },
                "hash": "2_4d45fbbc96",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 15.05,
                "url": "/uploads/2_4d45fbbc96.jpg",
                "created_at": "2020-12-24T08:40:51.554Z",
                "updated_at": "2020-12-24T08:40:51.590Z"
            },
            {
                "id": 611,
                "name": "3.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_3.jpg",
                        "hash": "thumbnail_3_780cc695ad",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.63,
                        "url": "/uploads/thumbnail_3_780cc695ad.jpg"
                    }
                },
                "hash": "3_780cc695ad",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 28.18,
                "url": "/uploads/3_780cc695ad.jpg",
                "created_at": "2020-12-24T08:40:51.663Z",
                "updated_at": "2020-12-24T08:40:51.697Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            },
            {
                "id": 3,
                "name": "Shoes",
                "slug": "shoes",
                "created_at": "2020-03-14T10:25:39.408Z",
                "updated_at": "2020-12-24T01:57:14.431Z"
            },
            {
                "id": 2,
                "name": "Men",
                "slug": "men",
                "created_at": "2020-03-14T10:25:21.611Z",
                "updated_at": "2020-12-24T01:57:00.242Z"
            }
        ]
    },
    {
        "id": 96,
        "name": "Printed Sweatshirt",
        "slug": "printed-sweatshirt",
        "short_desc": "This is a sample of long description. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 12.99,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T08:45:05.493Z",
        "updated_at": "2021-01-21T05:13:19.595Z",
        "pictures": [
            {
                "id": 612,
                "name": "product-1-1.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-1.jpg",
                        "hash": "thumbnail_product_1_1_e44ea6b001",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.91,
                        "url": "/uploads/thumbnail_product_1_1_e44ea6b001.jpg"
                    },
                    "large": {
                        "name": "large_product-1-1.jpg",
                        "hash": "large_product_1_1_e44ea6b001",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 106.26,
                        "url": "/uploads/large_product_1_1_e44ea6b001.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-1.jpg",
                        "hash": "medium_product_1_1_e44ea6b001",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 65.34,
                        "url": "/uploads/medium_product_1_1_e44ea6b001.jpg"
                    },
                    "small": {
                        "name": "small_product-1-1.jpg",
                        "hash": "small_product_1_1_e44ea6b001",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 31.3,
                        "url": "/uploads/small_product_1_1_e44ea6b001.jpg"
                    }
                },
                "hash": "product_1_1_e44ea6b001",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 102.72,
                "url": "/uploads/product_1_1_e44ea6b001.jpg",
                "created_at": "2020-12-24T08:43:25.529Z",
                "updated_at": "2020-12-24T08:43:25.639Z"
            },
            {
                "id": 613,
                "name": "product-1-2.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-2.jpg",
                        "hash": "thumbnail_product_1_2_08bb219386",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 5.61,
                        "url": "/uploads/thumbnail_product_1_2_08bb219386.jpg"
                    },
                    "large": {
                        "name": "large_product-1-2.jpg",
                        "hash": "large_product_1_2_08bb219386",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 141.12,
                        "url": "/uploads/large_product_1_2_08bb219386.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-2.jpg",
                        "hash": "medium_product_1_2_08bb219386",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 87.9,
                        "url": "/uploads/medium_product_1_2_08bb219386.jpg"
                    },
                    "small": {
                        "name": "small_product-1-2.jpg",
                        "hash": "small_product_1_2_08bb219386",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 42.33,
                        "url": "/uploads/small_product_1_2_08bb219386.jpg"
                    }
                },
                "hash": "product_1_2_08bb219386",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 133.92,
                "url": "/uploads/product_1_2_08bb219386.jpg",
                "created_at": "2020-12-24T08:43:25.554Z",
                "updated_at": "2020-12-24T08:43:25.674Z"
            },
            {
                "id": 615,
                "name": "product-1-3.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-3.jpg",
                        "hash": "thumbnail_product_1_3_288d572a84",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 5.36,
                        "url": "/uploads/thumbnail_product_1_3_288d572a84.jpg"
                    },
                    "large": {
                        "name": "large_product-1-3.jpg",
                        "hash": "large_product_1_3_288d572a84",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 124.22,
                        "url": "/uploads/large_product_1_3_288d572a84.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-3.jpg",
                        "hash": "medium_product_1_3_288d572a84",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 79.16,
                        "url": "/uploads/medium_product_1_3_288d572a84.jpg"
                    },
                    "small": {
                        "name": "small_product-1-3.jpg",
                        "hash": "small_product_1_3_288d572a84",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 38.92,
                        "url": "/uploads/small_product_1_3_288d572a84.jpg"
                    }
                },
                "hash": "product_1_3_288d572a84",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 116.69,
                "url": "/uploads/product_1_3_288d572a84.jpg",
                "created_at": "2020-12-24T08:43:25.595Z",
                "updated_at": "2020-12-24T08:43:25.748Z"
            },
            {
                "id": 614,
                "name": "product-1-4.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-4.jpg",
                        "hash": "thumbnail_product_1_4_01a63f4949",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 5.56,
                        "url": "/uploads/thumbnail_product_1_4_01a63f4949.jpg"
                    },
                    "large": {
                        "name": "large_product-1-4.jpg",
                        "hash": "large_product_1_4_01a63f4949",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 149.24,
                        "url": "/uploads/large_product_1_4_01a63f4949.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-4.jpg",
                        "hash": "medium_product_1_4_01a63f4949",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 93.12,
                        "url": "/uploads/medium_product_1_4_01a63f4949.jpg"
                    },
                    "small": {
                        "name": "small_product-1-4.jpg",
                        "hash": "small_product_1_4_01a63f4949",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 44.55,
                        "url": "/uploads/small_product_1_4_01a63f4949.jpg"
                    }
                },
                "hash": "product_1_4_01a63f4949",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 142.53,
                "url": "/uploads/product_1_4_01a63f4949.jpg",
                "created_at": "2020-12-24T08:43:25.575Z",
                "updated_at": "2020-12-24T08:43:25.714Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 616,
                "name": "product-1-1-300x408.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-1-300x408.jpg",
                        "hash": "thumbnail_product_1_1_300x408_1f662c0197",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.84,
                        "url": "/uploads/thumbnail_product_1_1_300x408_1f662c0197.jpg"
                    }
                },
                "hash": "product_1_1_300x408_1f662c0197",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 20.08,
                "url": "/uploads/product_1_1_300x408_1f662c0197.jpg",
                "created_at": "2020-12-24T08:43:44.749Z",
                "updated_at": "2020-12-24T08:43:44.873Z"
            },
            {
                "id": 618,
                "name": "product-1-2-300x408.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-2-300x408.jpg",
                        "hash": "thumbnail_product_1_2_300x408_9e213baa0a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 5.53,
                        "url": "/uploads/thumbnail_product_1_2_300x408_9e213baa0a.jpg"
                    }
                },
                "hash": "product_1_2_300x408_9e213baa0a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 30.62,
                "url": "/uploads/product_1_2_300x408_9e213baa0a.jpg",
                "created_at": "2020-12-24T08:43:44.814Z",
                "updated_at": "2020-12-24T08:43:44.963Z"
            },
            {
                "id": 617,
                "name": "product-1-3-300x408.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-3-300x408.jpg",
                        "hash": "thumbnail_product_1_3_300x408_21f126ec4b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 5.24,
                        "url": "/uploads/thumbnail_product_1_3_300x408_21f126ec4b.jpg"
                    }
                },
                "hash": "product_1_3_300x408_21f126ec4b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 28.42,
                "url": "/uploads/product_1_3_300x408_21f126ec4b.jpg",
                "created_at": "2020-12-24T08:43:44.787Z",
                "updated_at": "2020-12-24T08:43:44.925Z"
            },
            {
                "id": 619,
                "name": "product-1-4-300x408.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-4-300x408.jpg",
                        "hash": "thumbnail_product_1_4_300x408_a9d690bee3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 5.45,
                        "url": "/uploads/thumbnail_product_1_4_300x408_a9d690bee3.jpg"
                    }
                },
                "hash": "product_1_4_300x408_a9d690bee3",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 31.85,
                "url": "/uploads/product_1_4_300x408_a9d690bee3.jpg",
                "created_at": "2020-12-24T08:43:44.837Z",
                "updated_at": "2020-12-24T08:43:45.002Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            },
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            }
        ]
    },
    {
        "id": 97,
        "name": "Black Jeans",
        "slug": "black-jeans",
        "short_desc": "This is a sample of long description. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 14.99,
        "stock": 100,
        "new": true,
        "created_at": "2020-12-24T08:51:57.845Z",
        "updated_at": "2021-01-25T13:25:31.114Z",
        "pictures": [
            {
                "id": 622,
                "name": "product-2-1.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-1.jpg",
                        "hash": "thumbnail_product_2_1_7ee61ecd14",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.22,
                        "url": "/uploads/thumbnail_product_2_1_7ee61ecd14.jpg"
                    },
                    "large": {
                        "name": "large_product-2-1.jpg",
                        "hash": "large_product_2_1_7ee61ecd14",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 56.64,
                        "url": "/uploads/large_product_2_1_7ee61ecd14.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-1.jpg",
                        "hash": "medium_product_2_1_7ee61ecd14",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 33.66,
                        "url": "/uploads/medium_product_2_1_7ee61ecd14.jpg"
                    },
                    "small": {
                        "name": "small_product-2-1.jpg",
                        "hash": "small_product_2_1_7ee61ecd14",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 15,
                        "url": "/uploads/small_product_2_1_7ee61ecd14.jpg"
                    }
                },
                "hash": "product_2_1_7ee61ecd14",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 52.67,
                "url": "/uploads/product_2_1_7ee61ecd14.jpg",
                "created_at": "2020-12-24T08:45:51.015Z",
                "updated_at": "2020-12-24T08:45:51.113Z"
            },
            {
                "id": 620,
                "name": "product-2-2.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-2.jpg",
                        "hash": "thumbnail_product_2_2_3fb624d15a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.07,
                        "url": "/uploads/thumbnail_product_2_2_3fb624d15a.jpg"
                    },
                    "large": {
                        "name": "large_product-2-2.jpg",
                        "hash": "large_product_2_2_3fb624d15a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 49.91,
                        "url": "/uploads/large_product_2_2_3fb624d15a.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-2.jpg",
                        "hash": "medium_product_2_2_3fb624d15a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 31.63,
                        "url": "/uploads/medium_product_2_2_3fb624d15a.jpg"
                    },
                    "small": {
                        "name": "small_product-2-2.jpg",
                        "hash": "small_product_2_2_3fb624d15a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 16.18,
                        "url": "/uploads/small_product_2_2_3fb624d15a.jpg"
                    }
                },
                "hash": "product_2_2_3fb624d15a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 45.45,
                "url": "/uploads/product_2_2_3fb624d15a.jpg",
                "created_at": "2020-12-24T08:45:50.969Z",
                "updated_at": "2020-12-24T08:45:51.052Z"
            },
            {
                "id": 621,
                "name": "product-2-3.jpg",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-3.jpg",
                        "hash": "thumbnail_product_2_3_57015e89c7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.97,
                        "url": "/uploads/thumbnail_product_2_3_57015e89c7.jpg"
                    },
                    "large": {
                        "name": "large_product-2-3.jpg",
                        "hash": "large_product_2_3_57015e89c7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 50.68,
                        "url": "/uploads/large_product_2_3_57015e89c7.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-3.jpg",
                        "hash": "medium_product_2_3_57015e89c7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 32.09,
                        "url": "/uploads/medium_product_2_3_57015e89c7.jpg"
                    },
                    "small": {
                        "name": "small_product-2-3.jpg",
                        "hash": "small_product_2_3_57015e89c7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 16.37,
                        "url": "/uploads/small_product_2_3_57015e89c7.jpg"
                    }
                },
                "hash": "product_2_3_57015e89c7",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 46.65,
                "url": "/uploads/product_2_3_57015e89c7.jpg",
                "created_at": "2020-12-24T08:45:50.995Z",
                "updated_at": "2020-12-24T08:45:51.082Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 623,
                "name": "product-2-1-300x408.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-1-300x408.jpg",
                        "hash": "thumbnail_product_2_1_300x408_8a022bf381",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.22,
                        "url": "/uploads/thumbnail_product_2_1_300x408_8a022bf381.jpg"
                    }
                },
                "hash": "product_2_1_300x408_8a022bf381",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 9.84,
                "url": "/uploads/product_2_1_300x408_8a022bf381.jpg",
                "created_at": "2020-12-24T08:46:00.857Z",
                "updated_at": "2020-12-24T08:46:00.891Z"
            },
            {
                "id": 624,
                "name": "product-2-2-300x408.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-2-300x408.jpg",
                        "hash": "thumbnail_product_2_2_300x408_edddfecb50",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.02,
                        "url": "/uploads/thumbnail_product_2_2_300x408_edddfecb50.jpg"
                    }
                },
                "hash": "product_2_2_300x408_edddfecb50",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.01,
                "url": "/uploads/product_2_2_300x408_edddfecb50.jpg",
                "created_at": "2020-12-24T08:46:00.957Z",
                "updated_at": "2020-12-24T08:46:00.988Z"
            },
            {
                "id": 625,
                "name": "product-2-3-300x408.jpg",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-3-300x408.jpg",
                        "hash": "thumbnail_product_2_3_300x408_a8f9e18e67",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.95,
                        "url": "/uploads/thumbnail_product_2_3_300x408_a8f9e18e67.jpg"
                    }
                },
                "hash": "product_2_3_300x408_a8f9e18e67",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.16,
                "url": "/uploads/product_2_3_300x408_a8f9e18e67.jpg",
                "created_at": "2020-12-24T08:46:01.057Z",
                "updated_at": "2020-12-24T08:46:01.090Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            },
            {
                "id": 2,
                "name": "Men",
                "slug": "men",
                "created_at": "2020-03-14T10:25:21.611Z",
                "updated_at": "2020-12-24T01:57:00.242Z"
            },
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            }
        ]
    },
    {
        "id": 98,
        "name": "Trainers",
        "slug": "trainers",
        "short_desc": "This is a sample of long description. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 29.99,
        "stock": 203,
        "new": true,
        "created_at": "2020-12-24T09:06:53.773Z",
        "updated_at": "2021-01-21T05:19:00.738Z",
        "pictures": [
            {
                "id": 1662,
                "name": "2-1.jpg",
                "caption": "",
                "width": 335,
                "height": 480,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-1.jpg",
                        "hash": "thumbnail_2_1_2639891b2f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 109,
                        "height": 156,
                        "size": 2.14,
                        "url": "/uploads/thumbnail_2_1_2639891b2f.jpg"
                    }
                },
                "hash": "2_1_2639891b2f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.79,
                "url": "/uploads/2_1_2639891b2f.jpg",
                "created_at": "2021-01-15T07:59:38.002Z",
                "updated_at": "2021-01-15T07:59:38.075Z"
            },
            {
                "id": 1661,
                "name": "2-2.jpg",
                "caption": "",
                "width": 335,
                "height": 480,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-2.jpg",
                        "hash": "thumbnail_2_2_7dc0f060e6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 109,
                        "height": 156,
                        "size": 1.62,
                        "url": "/uploads/thumbnail_2_2_7dc0f060e6.jpg"
                    }
                },
                "hash": "2_2_7dc0f060e6",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 8.56,
                "url": "/uploads/2_2_7dc0f060e6.jpg",
                "created_at": "2021-01-15T07:59:37.974Z",
                "updated_at": "2021-01-15T07:59:38.040Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 1662,
                "name": "2-1.jpg",
                "caption": "",
                "width": 335,
                "height": 480,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-1.jpg",
                        "hash": "thumbnail_2_1_2639891b2f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 109,
                        "height": 156,
                        "size": 2.14,
                        "url": "/uploads/thumbnail_2_1_2639891b2f.jpg"
                    }
                },
                "hash": "2_1_2639891b2f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.79,
                "url": "/uploads/2_1_2639891b2f.jpg",
                "created_at": "2021-01-15T07:59:38.002Z",
                "updated_at": "2021-01-15T07:59:38.075Z"
            },
            {
                "id": 1661,
                "name": "2-2.jpg",
                "caption": "",
                "width": 335,
                "height": 480,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_2-2.jpg",
                        "hash": "thumbnail_2_2_7dc0f060e6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 109,
                        "height": 156,
                        "size": 1.62,
                        "url": "/uploads/thumbnail_2_2_7dc0f060e6.jpg"
                    }
                },
                "hash": "2_2_7dc0f060e6",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 8.56,
                "url": "/uploads/2_2_7dc0f060e6.jpg",
                "created_at": "2021-01-15T07:59:37.974Z",
                "updated_at": "2021-01-15T07:59:38.040Z"
            }
        ],
        "category": [
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            },
            {
                "id": 2,
                "name": "Men",
                "slug": "men",
                "created_at": "2020-03-14T10:25:21.611Z",
                "updated_at": "2020-12-24T01:57:00.242Z"
            }
        ]
    },
    {
        "id": 99,
        "name": "Biker Jacket",
        "slug": "biker-jacket",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 23.99,
        "stock": 203,
        "new": null,
        "created_at": "2020-12-24T10:38:14.540Z",
        "updated_at": "2021-01-19T23:23:59.458Z",
        "pictures": [
            {
                "id": 633,
                "name": "product-4-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-1.jpg",
                        "hash": "thumbnail_product_4_1_ef8847a107",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.91,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_1_ef8847a107.jpg"
                    },
                    "large": {
                        "name": "large_product-4-1.jpg",
                        "hash": "large_product_4_1_ef8847a107",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 52.73,
                        "path": null,
                        "url": "/uploads/large_product_4_1_ef8847a107.jpg"
                    },
                    "medium": {
                        "name": "medium_product-4-1.jpg",
                        "hash": "medium_product_4_1_ef8847a107",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 31.96,
                        "path": null,
                        "url": "/uploads/medium_product_4_1_ef8847a107.jpg"
                    },
                    "small": {
                        "name": "small_product-4-1.jpg",
                        "hash": "small_product_4_1_ef8847a107",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 15.54,
                        "path": null,
                        "url": "/uploads/small_product_4_1_ef8847a107.jpg"
                    }
                },
                "hash": "product_4_1_ef8847a107",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 46.28,
                "url": "/uploads/product_4_1_ef8847a107.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:19.363Z",
                "updated_at": "2020-12-24T10:35:19.480Z"
            },
            {
                "id": 632,
                "name": "product-4-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-2.jpg",
                        "hash": "thumbnail_product_4_2_364fb96a04",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.28,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_2_364fb96a04.jpg"
                    },
                    "large": {
                        "name": "large_product-4-2.jpg",
                        "hash": "large_product_4_2_364fb96a04",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 61.61,
                        "path": null,
                        "url": "/uploads/large_product_4_2_364fb96a04.jpg"
                    },
                    "medium": {
                        "name": "medium_product-4-2.jpg",
                        "hash": "medium_product_4_2_364fb96a04",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 38.13,
                        "path": null,
                        "url": "/uploads/medium_product_4_2_364fb96a04.jpg"
                    },
                    "small": {
                        "name": "small_product-4-2.jpg",
                        "hash": "small_product_4_2_364fb96a04",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 18.72,
                        "path": null,
                        "url": "/uploads/small_product_4_2_364fb96a04.jpg"
                    }
                },
                "hash": "product_4_2_364fb96a04",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 55.6,
                "url": "/uploads/product_4_2_364fb96a04.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:19.335Z",
                "updated_at": "2020-12-24T10:35:19.446Z"
            },
            {
                "id": 634,
                "name": "product-4-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-3.jpg",
                        "hash": "thumbnail_product_4_3_0e392227fd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.41,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_3_0e392227fd.jpg"
                    },
                    "large": {
                        "name": "large_product-4-3.jpg",
                        "hash": "large_product_4_3_0e392227fd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 70.61,
                        "path": null,
                        "url": "/uploads/large_product_4_3_0e392227fd.jpg"
                    },
                    "medium": {
                        "name": "medium_product-4-3.jpg",
                        "hash": "medium_product_4_3_0e392227fd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 42.7,
                        "path": null,
                        "url": "/uploads/medium_product_4_3_0e392227fd.jpg"
                    },
                    "small": {
                        "name": "small_product-4-3.jpg",
                        "hash": "small_product_4_3_0e392227fd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 20.15,
                        "path": null,
                        "url": "/uploads/small_product_4_3_0e392227fd.jpg"
                    }
                },
                "hash": "product_4_3_0e392227fd",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 61.66,
                "url": "/uploads/product_4_3_0e392227fd.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:19.385Z",
                "updated_at": "2020-12-24T10:35:19.516Z"
            },
            {
                "id": 635,
                "name": "product-4-4.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-4.jpg",
                        "hash": "thumbnail_product_4_4_e42faa4191",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.39,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_4_e42faa4191.jpg"
                    },
                    "large": {
                        "name": "large_product-4-4.jpg",
                        "hash": "large_product_4_4_e42faa4191",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 87.76,
                        "path": null,
                        "url": "/uploads/large_product_4_4_e42faa4191.jpg"
                    },
                    "medium": {
                        "name": "medium_product-4-4.jpg",
                        "hash": "medium_product_4_4_e42faa4191",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 53.53,
                        "path": null,
                        "url": "/uploads/medium_product_4_4_e42faa4191.jpg"
                    },
                    "small": {
                        "name": "small_product-4-4.jpg",
                        "hash": "small_product_4_4_e42faa4191",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 26.01,
                        "path": null,
                        "url": "/uploads/small_product_4_4_e42faa4191.jpg"
                    }
                },
                "hash": "product_4_4_e42faa4191",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 77.76,
                "url": "/uploads/product_4_4_e42faa4191.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:19.406Z",
                "updated_at": "2020-12-24T10:35:19.553Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 636,
                "name": "product-4-1-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-1-300x408.jpg",
                        "hash": "thumbnail_product_4_1_300x408_5d955e425b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.9,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_1_300x408_5d955e425b.jpg"
                    }
                },
                "hash": "product_4_1_300x408_5d955e425b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.69,
                "url": "/uploads/product_4_1_300x408_5d955e425b.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:50.295Z",
                "updated_at": "2020-12-24T10:35:50.416Z"
            },
            {
                "id": 637,
                "name": "product-4-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-2-300x408.jpg",
                        "hash": "thumbnail_product_4_2_300x408_5c1ff41318",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.24,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_2_300x408_5c1ff41318.jpg"
                    }
                },
                "hash": "product_4_2_300x408_5c1ff41318",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 12.73,
                "url": "/uploads/product_4_2_300x408_5c1ff41318.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:50.336Z",
                "updated_at": "2020-12-24T10:35:50.456Z"
            },
            {
                "id": 638,
                "name": "product-4-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-3-300x408.jpg",
                        "hash": "thumbnail_product_4_3_300x408_b73efbb65e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.38,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_3_300x408_b73efbb65e.jpg"
                    }
                },
                "hash": "product_4_3_300x408_b73efbb65e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 14.56,
                "url": "/uploads/product_4_3_300x408_b73efbb65e.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:50.364Z",
                "updated_at": "2020-12-24T10:35:50.487Z"
            },
            {
                "id": 639,
                "name": "product-4-4-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-4-300x408.jpg",
                        "hash": "thumbnail_product_4_4_300x408_a4039568f3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.33,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_4_300x408_a4039568f3.jpg"
                    }
                },
                "hash": "product_4_4_300x408_a4039568f3",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 18.95,
                "url": "/uploads/product_4_4_300x408_a4039568f3.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:35:50.386Z",
                "updated_at": "2020-12-24T10:35:50.525Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            },
            {
                "id": 2,
                "name": "Men",
                "slug": "men",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:25:21.611Z",
                "updated_at": "2020-12-24T01:57:00.242Z"
            },
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            }
        ]
    },
    {
        "id": 100,
        "name": "Marmot Empire Daypack",
        "slug": "marmot-empire-daypack",
        "short_desc": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing. Sed lectus.",
        "price": 17.99,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T10:41:12.570Z",
        "updated_at": "2021-01-23T07:33:01.496Z",
        "pictures": [
            {
                "id": 640,
                "name": "product-9-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-1.jpg",
                        "hash": "thumbnail_product_9_1_9e47740d83",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.69,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_1_9e47740d83.jpg"
                    },
                    "large": {
                        "name": "large_product-9-1.jpg",
                        "hash": "large_product_9_1_9e47740d83",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 85.76,
                        "path": null,
                        "url": "/uploads/large_product_9_1_9e47740d83.jpg"
                    },
                    "medium": {
                        "name": "medium_product-9-1.jpg",
                        "hash": "medium_product_9_1_9e47740d83",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 56.88,
                        "path": null,
                        "url": "/uploads/medium_product_9_1_9e47740d83.jpg"
                    },
                    "small": {
                        "name": "small_product-9-1.jpg",
                        "hash": "small_product_9_1_9e47740d83",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 29.85,
                        "path": null,
                        "url": "/uploads/small_product_9_1_9e47740d83.jpg"
                    }
                },
                "hash": "product_9_1_9e47740d83",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 78.5,
                "url": "/uploads/product_9_1_9e47740d83.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:38:48.608Z",
                "updated_at": "2020-12-24T10:38:48.706Z"
            },
            {
                "id": 641,
                "name": "product-9-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-2.jpg",
                        "hash": "thumbnail_product_9_2_e3529af393",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.45,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_2_e3529af393.jpg"
                    },
                    "large": {
                        "name": "large_product-9-2.jpg",
                        "hash": "large_product_9_2_e3529af393",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 78.8,
                        "path": null,
                        "url": "/uploads/large_product_9_2_e3529af393.jpg"
                    },
                    "medium": {
                        "name": "medium_product-9-2.jpg",
                        "hash": "medium_product_9_2_e3529af393",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 52.72,
                        "path": null,
                        "url": "/uploads/medium_product_9_2_e3529af393.jpg"
                    },
                    "small": {
                        "name": "small_product-9-2.jpg",
                        "hash": "small_product_9_2_e3529af393",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 27.68,
                        "path": null,
                        "url": "/uploads/small_product_9_2_e3529af393.jpg"
                    }
                },
                "hash": "product_9_2_e3529af393",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 71.99,
                "url": "/uploads/product_9_2_e3529af393.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:38:48.638Z",
                "updated_at": "2020-12-24T10:38:48.743Z"
            },
            {
                "id": 642,
                "name": "product-9-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-3.jpg",
                        "hash": "thumbnail_product_9_3_a118511d7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.37,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_3_a118511d7d.jpg"
                    },
                    "large": {
                        "name": "large_product-9-3.jpg",
                        "hash": "large_product_9_3_a118511d7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 91.16,
                        "path": null,
                        "url": "/uploads/large_product_9_3_a118511d7d.jpg"
                    },
                    "medium": {
                        "name": "medium_product-9-3.jpg",
                        "hash": "medium_product_9_3_a118511d7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 59.5,
                        "path": null,
                        "url": "/uploads/medium_product_9_3_a118511d7d.jpg"
                    },
                    "small": {
                        "name": "small_product-9-3.jpg",
                        "hash": "small_product_9_3_a118511d7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 29.27,
                        "path": null,
                        "url": "/uploads/small_product_9_3_a118511d7d.jpg"
                    }
                },
                "hash": "product_9_3_a118511d7d",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 84.32,
                "url": "/uploads/product_9_3_a118511d7d.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:38:48.662Z",
                "updated_at": "2020-12-24T10:38:48.780Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 643,
                "name": "product-9-1-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-1-300x408.jpg",
                        "hash": "thumbnail_product_9_1_300x408_85c7c8c4a5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.68,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_1_300x408_85c7c8c4a5.jpg"
                    }
                },
                "hash": "product_9_1_300x408_85c7c8c4a5",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 21.93,
                "url": "/uploads/product_9_1_300x408_85c7c8c4a5.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:39:11.538Z",
                "updated_at": "2020-12-24T10:39:11.628Z"
            },
            {
                "id": 644,
                "name": "product-9-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-2-300x408.jpg",
                        "hash": "thumbnail_product_9_2_300x408_c99edaabfc",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.41,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_2_300x408_c99edaabfc.jpg"
                    }
                },
                "hash": "product_9_2_300x408_c99edaabfc",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 20.09,
                "url": "/uploads/product_9_2_300x408_c99edaabfc.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:39:11.562Z",
                "updated_at": "2020-12-24T10:39:11.663Z"
            },
            {
                "id": 645,
                "name": "product-9-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-3-300x408.jpg",
                        "hash": "thumbnail_product_9_3_300x408_3ca1052b97",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.34,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_3_300x408_3ca1052b97.jpg"
                    }
                },
                "hash": "product_9_3_300x408_3ca1052b97",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 21.24,
                "url": "/uploads/product_9_3_300x408_3ca1052b97.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:39:11.587Z",
                "updated_at": "2020-12-24T10:39:11.700Z"
            }
        ],
        "category": [
            {
                "id": 2,
                "name": "Men",
                "slug": "men",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:25:21.611Z",
                "updated_at": "2020-12-24T01:57:00.242Z"
            },
            {
                "id": 6,
                "name": "Bags",
                "slug": "bags",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:39.769Z",
                "updated_at": "2020-12-24T01:58:11.193Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 101,
        "name": "Denim Jacket",
        "slug": "denim-jacket",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 19.99,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T10:46:17.531Z",
        "updated_at": "2021-01-21T05:12:46.591Z",
        "pictures": [
            {
                "id": 647,
                "name": "product-7-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-2.jpg",
                        "hash": "thumbnail_product_7_2_d00ce48601",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.84,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_2_d00ce48601.jpg"
                    },
                    "large": {
                        "name": "large_product-7-2.jpg",
                        "hash": "large_product_7_2_d00ce48601",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 50.41,
                        "path": null,
                        "url": "/uploads/large_product_7_2_d00ce48601.jpg"
                    },
                    "medium": {
                        "name": "medium_product-7-2.jpg",
                        "hash": "medium_product_7_2_d00ce48601",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 30.57,
                        "path": null,
                        "url": "/uploads/medium_product_7_2_d00ce48601.jpg"
                    },
                    "small": {
                        "name": "small_product-7-2.jpg",
                        "hash": "small_product_7_2_d00ce48601",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 14.89,
                        "path": null,
                        "url": "/uploads/small_product_7_2_d00ce48601.jpg"
                    }
                },
                "hash": "product_7_2_d00ce48601",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 43.49,
                "url": "/uploads/product_7_2_d00ce48601.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:42:18.810Z",
                "updated_at": "2020-12-24T10:42:18.933Z"
            },
            {
                "id": 649,
                "name": "product-7-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-3.jpg",
                        "hash": "thumbnail_product_7_3_6f5d9cd3be",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.82,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_3_6f5d9cd3be.jpg"
                    },
                    "large": {
                        "name": "large_product-7-3.jpg",
                        "hash": "large_product_7_3_6f5d9cd3be",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 84.17,
                        "path": null,
                        "url": "/uploads/large_product_7_3_6f5d9cd3be.jpg"
                    },
                    "medium": {
                        "name": "medium_product-7-3.jpg",
                        "hash": "medium_product_7_3_6f5d9cd3be",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 50.7,
                        "path": null,
                        "url": "/uploads/medium_product_7_3_6f5d9cd3be.jpg"
                    },
                    "small": {
                        "name": "small_product-7-3.jpg",
                        "hash": "small_product_7_3_6f5d9cd3be",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 23.96,
                        "path": null,
                        "url": "/uploads/small_product_7_3_6f5d9cd3be.jpg"
                    }
                },
                "hash": "product_7_3_6f5d9cd3be",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 75.41,
                "url": "/uploads/product_7_3_6f5d9cd3be.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:42:18.858Z",
                "updated_at": "2020-12-24T10:42:19.002Z"
            },
            {
                "id": 648,
                "name": "product-7-4.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-4.jpg",
                        "hash": "thumbnail_product_7_4_094df63be5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.21,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_4_094df63be5.jpg"
                    },
                    "large": {
                        "name": "large_product-7-4.jpg",
                        "hash": "large_product_7_4_094df63be5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 84.52,
                        "path": null,
                        "url": "/uploads/large_product_7_4_094df63be5.jpg"
                    },
                    "medium": {
                        "name": "medium_product-7-4.jpg",
                        "hash": "medium_product_7_4_094df63be5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 52.03,
                        "path": null,
                        "url": "/uploads/medium_product_7_4_094df63be5.jpg"
                    },
                    "small": {
                        "name": "small_product-7-4.jpg",
                        "hash": "small_product_7_4_094df63be5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 25.51,
                        "path": null,
                        "url": "/uploads/small_product_7_4_094df63be5.jpg"
                    }
                },
                "hash": "product_7_4_094df63be5",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 76.9,
                "url": "/uploads/product_7_4_094df63be5.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:42:18.831Z",
                "updated_at": "2020-12-24T10:42:18.966Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 651,
                "name": "product-7-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-2-300x408.jpg",
                        "hash": "thumbnail_product_7_2_300x408_22bf0655ad",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.82,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_2_300x408_22bf0655ad.jpg"
                    }
                },
                "hash": "product_7_2_300x408_22bf0655ad",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.36,
                "url": "/uploads/product_7_2_300x408_22bf0655ad.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:42:49.045Z",
                "updated_at": "2020-12-24T10:42:49.165Z"
            },
            {
                "id": 652,
                "name": "product-7-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-3-300x408.jpg",
                        "hash": "thumbnail_product_7_3_300x408_2e98eaeb9f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.79,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_3_300x408_2e98eaeb9f.jpg"
                    }
                },
                "hash": "product_7_3_300x408_2e98eaeb9f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 17.28,
                "url": "/uploads/product_7_3_300x408_2e98eaeb9f.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:42:49.069Z",
                "updated_at": "2020-12-24T10:42:49.199Z"
            },
            {
                "id": 653,
                "name": "product-7-4-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-4-300x408.jpg",
                        "hash": "thumbnail_product_7_4_300x408_82f7f11127",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.18,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_4_300x408_82f7f11127.jpg"
                    }
                },
                "hash": "product_7_4_300x408_82f7f11127",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 18.67,
                "url": "/uploads/product_7_4_300x408_82f7f11127.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:42:49.092Z",
                "updated_at": "2020-12-24T10:42:49.237Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            },
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            },
            {
                "id": 2,
                "name": "Men",
                "slug": "men",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:25:21.611Z",
                "updated_at": "2020-12-24T01:57:00.242Z"
            }
        ]
    },
    {
        "id": 102,
        "name": "Linen-blend paper bag trousers",
        "slug": "linen-blend-paper-bag-trousers",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 15.99,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T10:49:08.275Z",
        "updated_at": "2021-01-21T05:13:31.926Z",
        "pictures": [
            {
                "id": 656,
                "name": "product-8-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-1.jpg",
                        "hash": "thumbnail_product_8_1_72e07f48f1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.56,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_1_72e07f48f1.jpg"
                    },
                    "large": {
                        "name": "large_product-8-1.jpg",
                        "hash": "large_product_8_1_72e07f48f1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 91.99,
                        "path": null,
                        "url": "/uploads/large_product_8_1_72e07f48f1.jpg"
                    },
                    "medium": {
                        "name": "medium_product-8-1.jpg",
                        "hash": "medium_product_8_1_72e07f48f1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 59.12,
                        "path": null,
                        "url": "/uploads/medium_product_8_1_72e07f48f1.jpg"
                    },
                    "small": {
                        "name": "small_product-8-1.jpg",
                        "hash": "small_product_8_1_72e07f48f1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 29.92,
                        "path": null,
                        "url": "/uploads/small_product_8_1_72e07f48f1.jpg"
                    }
                },
                "hash": "product_8_1_72e07f48f1",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 84.46,
                "url": "/uploads/product_8_1_72e07f48f1.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:47:07.219Z",
                "updated_at": "2020-12-24T10:47:07.335Z"
            },
            {
                "id": 654,
                "name": "product-8-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-2.jpg",
                        "hash": "thumbnail_product_8_2_7fe692f65a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.58,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_2_7fe692f65a.jpg"
                    },
                    "large": {
                        "name": "large_product-8-2.jpg",
                        "hash": "large_product_8_2_7fe692f65a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 68.44,
                        "path": null,
                        "url": "/uploads/large_product_8_2_7fe692f65a.jpg"
                    },
                    "medium": {
                        "name": "medium_product-8-2.jpg",
                        "hash": "medium_product_8_2_7fe692f65a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 43.86,
                        "path": null,
                        "url": "/uploads/medium_product_8_2_7fe692f65a.jpg"
                    },
                    "small": {
                        "name": "small_product-8-2.jpg",
                        "hash": "small_product_8_2_7fe692f65a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 22.13,
                        "path": null,
                        "url": "/uploads/small_product_8_2_7fe692f65a.jpg"
                    }
                },
                "hash": "product_8_2_7fe692f65a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 64.24,
                "url": "/uploads/product_8_2_7fe692f65a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:47:07.177Z",
                "updated_at": "2020-12-24T10:47:07.275Z"
            },
            {
                "id": 655,
                "name": "product-8-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-3.jpg",
                        "hash": "thumbnail_product_8_3_9adb24513e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.53,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_3_9adb24513e.jpg"
                    },
                    "large": {
                        "name": "large_product-8-3.jpg",
                        "hash": "large_product_8_3_9adb24513e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 64.71,
                        "path": null,
                        "url": "/uploads/large_product_8_3_9adb24513e.jpg"
                    },
                    "medium": {
                        "name": "medium_product-8-3.jpg",
                        "hash": "medium_product_8_3_9adb24513e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 41.35,
                        "path": null,
                        "url": "/uploads/medium_product_8_3_9adb24513e.jpg"
                    },
                    "small": {
                        "name": "small_product-8-3.jpg",
                        "hash": "small_product_8_3_9adb24513e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 20.8,
                        "path": null,
                        "url": "/uploads/small_product_8_3_9adb24513e.jpg"
                    }
                },
                "hash": "product_8_3_9adb24513e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 60.46,
                "url": "/uploads/product_8_3_9adb24513e.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:47:07.201Z",
                "updated_at": "2020-12-24T10:47:07.304Z"
            },
            {
                "id": 657,
                "name": "product-8-4.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-4.jpg",
                        "hash": "thumbnail_product_8_4_cf221d835e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.47,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_4_cf221d835e.jpg"
                    },
                    "large": {
                        "name": "large_product-8-4.jpg",
                        "hash": "large_product_8_4_cf221d835e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 82.16,
                        "path": null,
                        "url": "/uploads/large_product_8_4_cf221d835e.jpg"
                    },
                    "medium": {
                        "name": "medium_product-8-4.jpg",
                        "hash": "medium_product_8_4_cf221d835e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 53.25,
                        "path": null,
                        "url": "/uploads/medium_product_8_4_cf221d835e.jpg"
                    },
                    "small": {
                        "name": "small_product-8-4.jpg",
                        "hash": "small_product_8_4_cf221d835e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 27.42,
                        "path": null,
                        "url": "/uploads/small_product_8_4_cf221d835e.jpg"
                    }
                },
                "hash": "product_8_4_cf221d835e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 74.52,
                "url": "/uploads/product_8_4_cf221d835e.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:47:07.238Z",
                "updated_at": "2020-12-24T10:47:07.366Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 658,
                "name": "product-8-1-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-1-300x408.jpg",
                        "hash": "thumbnail_product_8_1_300x408_d451a2ae2b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.51,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_1_300x408_d451a2ae2b.jpg"
                    }
                },
                "hash": "product_8_1_300x408_d451a2ae2b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 21.99,
                "url": "/uploads/product_8_1_300x408_d451a2ae2b.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:48:02.805Z",
                "updated_at": "2020-12-24T10:48:02.921Z"
            },
            {
                "id": 659,
                "name": "product-8-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-2-300x408.jpg",
                        "hash": "thumbnail_product_8_2_300x408_fd68021adc",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.54,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_2_300x408_fd68021adc.jpg"
                    }
                },
                "hash": "product_8_2_300x408_fd68021adc",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 14.19,
                "url": "/uploads/product_8_2_300x408_fd68021adc.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:48:02.837Z",
                "updated_at": "2020-12-24T10:48:02.961Z"
            },
            {
                "id": 661,
                "name": "product-8-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-3-300x408.jpg",
                        "hash": "thumbnail_product_8_3_300x408_53b143835c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.51,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_3_300x408_53b143835c.jpg"
                    }
                },
                "hash": "product_8_3_300x408_53b143835c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 13.43,
                "url": "/uploads/product_8_3_300x408_53b143835c.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:48:02.885Z",
                "updated_at": "2020-12-24T10:48:03.031Z"
            },
            {
                "id": 660,
                "name": "product-8-4-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-4-300x408.jpg",
                        "hash": "thumbnail_product_8_4_300x408_8a0d78879a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.39,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_4_300x408_8a0d78879a.jpg"
                    }
                },
                "hash": "product_8_4_300x408_8a0d78879a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 17.68,
                "url": "/uploads/product_8_4_300x408_8a0d78879a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:48:02.863Z",
                "updated_at": "2020-12-24T10:48:02.992Z"
            }
        ],
        "category": [
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 103,
        "name": "Small Bucket Bag",
        "slug": "small-bucket-bag",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 14.99,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T10:52:05.202Z",
        "updated_at": "2021-01-21T05:18:48.713Z",
        "pictures": [
            {
                "id": 663,
                "name": "product-6-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-1.jpg",
                        "hash": "thumbnail_product_6_1_f458795894",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.5,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_1_f458795894.jpg"
                    },
                    "large": {
                        "name": "large_product-6-1.jpg",
                        "hash": "large_product_6_1_f458795894",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 62.63,
                        "path": null,
                        "url": "/uploads/large_product_6_1_f458795894.jpg"
                    },
                    "medium": {
                        "name": "medium_product-6-1.jpg",
                        "hash": "medium_product_6_1_f458795894",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 36.23,
                        "path": null,
                        "url": "/uploads/medium_product_6_1_f458795894.jpg"
                    },
                    "small": {
                        "name": "small_product-6-1.jpg",
                        "hash": "small_product_6_1_f458795894",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 15.47,
                        "path": null,
                        "url": "/uploads/small_product_6_1_f458795894.jpg"
                    }
                },
                "hash": "product_6_1_f458795894",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 57.69,
                "url": "/uploads/product_6_1_f458795894.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:05.716Z",
                "updated_at": "2020-12-24T10:50:05.828Z"
            },
            {
                "id": 665,
                "name": "product-6-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-2.jpg",
                        "hash": "thumbnail_product_6_2_fba2744fea",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.88,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_2_fba2744fea.jpg"
                    },
                    "large": {
                        "name": "large_product-6-2.jpg",
                        "hash": "large_product_6_2_fba2744fea",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 71.11,
                        "path": null,
                        "url": "/uploads/large_product_6_2_fba2744fea.jpg"
                    },
                    "medium": {
                        "name": "medium_product-6-2.jpg",
                        "hash": "medium_product_6_2_fba2744fea",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 41.42,
                        "path": null,
                        "url": "/uploads/medium_product_6_2_fba2744fea.jpg"
                    },
                    "small": {
                        "name": "small_product-6-2.jpg",
                        "hash": "small_product_6_2_fba2744fea",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 17.58,
                        "path": null,
                        "url": "/uploads/small_product_6_2_fba2744fea.jpg"
                    }
                },
                "hash": "product_6_2_fba2744fea",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 65.63,
                "url": "/uploads/product_6_2_fba2744fea.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:05.756Z",
                "updated_at": "2020-12-24T10:50:05.898Z"
            },
            {
                "id": 664,
                "name": "product-6-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-3.jpg",
                        "hash": "thumbnail_product_6_3_bef3482d93",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.43,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_3_bef3482d93.jpg"
                    },
                    "large": {
                        "name": "large_product-6-3.jpg",
                        "hash": "large_product_6_3_bef3482d93",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 104.67,
                        "path": null,
                        "url": "/uploads/large_product_6_3_bef3482d93.jpg"
                    },
                    "medium": {
                        "name": "medium_product-6-3.jpg",
                        "hash": "medium_product_6_3_bef3482d93",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 67.38,
                        "path": null,
                        "url": "/uploads/medium_product_6_3_bef3482d93.jpg"
                    },
                    "small": {
                        "name": "small_product-6-3.jpg",
                        "hash": "small_product_6_3_bef3482d93",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 33.69,
                        "path": null,
                        "url": "/uploads/small_product_6_3_bef3482d93.jpg"
                    }
                },
                "hash": "product_6_3_bef3482d93",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 94.87,
                "url": "/uploads/product_6_3_bef3482d93.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:05.736Z",
                "updated_at": "2020-12-24T10:50:05.864Z"
            },
            {
                "id": 662,
                "name": "product-6-4.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-4.jpg",
                        "hash": "thumbnail_product_6_4_8d7c957812",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.82,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_4_8d7c957812.jpg"
                    },
                    "large": {
                        "name": "large_product-6-4.jpg",
                        "hash": "large_product_6_4_8d7c957812",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 67.75,
                        "path": null,
                        "url": "/uploads/large_product_6_4_8d7c957812.jpg"
                    },
                    "medium": {
                        "name": "medium_product-6-4.jpg",
                        "hash": "medium_product_6_4_8d7c957812",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 39.92,
                        "path": null,
                        "url": "/uploads/medium_product_6_4_8d7c957812.jpg"
                    },
                    "small": {
                        "name": "small_product-6-4.jpg",
                        "hash": "small_product_6_4_8d7c957812",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 16.84,
                        "path": null,
                        "url": "/uploads/small_product_6_4_8d7c957812.jpg"
                    }
                },
                "hash": "product_6_4_8d7c957812",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 62.11,
                "url": "/uploads/product_6_4_8d7c957812.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:05.687Z",
                "updated_at": "2020-12-24T10:50:05.796Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 666,
                "name": "product-6-1-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-1-300x408.jpg",
                        "hash": "thumbnail_product_6_1_300x408_0ecfb374f2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.52,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_1_300x408_0ecfb374f2.jpg"
                    }
                },
                "hash": "product_6_1_300x408_0ecfb374f2",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 10.25,
                "url": "/uploads/product_6_1_300x408_0ecfb374f2.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:31.182Z",
                "updated_at": "2020-12-24T10:50:31.295Z"
            },
            {
                "id": 667,
                "name": "product-6-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-2-300x408.jpg",
                        "hash": "thumbnail_product_6_2_300x408_6130a39faf",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.86,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_2_300x408_6130a39faf.jpg"
                    }
                },
                "hash": "product_6_2_300x408_6130a39faf",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.28,
                "url": "/uploads/product_6_2_300x408_6130a39faf.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:31.211Z",
                "updated_at": "2020-12-24T10:50:31.331Z"
            },
            {
                "id": 668,
                "name": "product-6-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-3-300x408.jpg",
                        "hash": "thumbnail_product_6_3_300x408_128eede4e4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 4.45,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_3_300x408_128eede4e4.jpg"
                    }
                },
                "hash": "product_6_3_300x408_128eede4e4",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 24.5,
                "url": "/uploads/product_6_3_300x408_128eede4e4.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:31.239Z",
                "updated_at": "2020-12-24T10:50:31.365Z"
            },
            {
                "id": 669,
                "name": "product-6-4-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-4-300x408.jpg",
                        "hash": "thumbnail_product_6_4_300x408_c659226482",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.8,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_4_300x408_c659226482.jpg"
                    }
                },
                "hash": "product_6_4_300x408_c659226482",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.29,
                "url": "/uploads/product_6_4_300x408_c659226482.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:50:31.260Z",
                "updated_at": "2020-12-24T10:50:31.402Z"
            }
        ],
        "category": [
            {
                "id": 2,
                "name": "Men",
                "slug": "men",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:25:21.611Z",
                "updated_at": "2020-12-24T01:57:00.242Z"
            },
            {
                "id": 6,
                "name": "Bags",
                "slug": "bags",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:39.769Z",
                "updated_at": "2020-12-24T01:58:11.193Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 104,
        "name": "Sandals",
        "slug": "sandals",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 17.99,
        "stock": 0,
        "new": null,
        "created_at": "2020-12-24T11:02:05.392Z",
        "updated_at": "2021-01-21T05:13:56.384Z",
        "pictures": [
            {
                "id": 670,
                "name": "product-10-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-1.jpg",
                        "hash": "thumbnail_product_10_1_bac3a325d4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.65,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_1_bac3a325d4.jpg"
                    },
                    "large": {
                        "name": "large_product-10-1.jpg",
                        "hash": "large_product_10_1_bac3a325d4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 40.19,
                        "path": null,
                        "url": "/uploads/large_product_10_1_bac3a325d4.jpg"
                    },
                    "medium": {
                        "name": "medium_product-10-1.jpg",
                        "hash": "medium_product_10_1_bac3a325d4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 25.22,
                        "path": null,
                        "url": "/uploads/medium_product_10_1_bac3a325d4.jpg"
                    },
                    "small": {
                        "name": "small_product-10-1.jpg",
                        "hash": "small_product_10_1_bac3a325d4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 13.23,
                        "path": null,
                        "url": "/uploads/small_product_10_1_bac3a325d4.jpg"
                    }
                },
                "hash": "product_10_1_bac3a325d4",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 35.66,
                "url": "/uploads/product_10_1_bac3a325d4.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:53:09.464Z",
                "updated_at": "2020-12-24T10:53:09.540Z"
            },
            {
                "id": 671,
                "name": "product-10-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-2.jpg",
                        "hash": "thumbnail_product_10_2_4e125fa3b6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 1.57,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_2_4e125fa3b6.jpg"
                    },
                    "large": {
                        "name": "large_product-10-2.jpg",
                        "hash": "large_product_10_2_4e125fa3b6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 20.97,
                        "path": null,
                        "url": "/uploads/large_product_10_2_4e125fa3b6.jpg"
                    },
                    "medium": {
                        "name": "medium_product-10-2.jpg",
                        "hash": "medium_product_10_2_4e125fa3b6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 13.27,
                        "path": null,
                        "url": "/uploads/medium_product_10_2_4e125fa3b6.jpg"
                    },
                    "small": {
                        "name": "small_product-10-2.jpg",
                        "hash": "small_product_10_2_4e125fa3b6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 7.13,
                        "path": null,
                        "url": "/uploads/small_product_10_2_4e125fa3b6.jpg"
                    }
                },
                "hash": "product_10_2_4e125fa3b6",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 19.36,
                "url": "/uploads/product_10_2_4e125fa3b6.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:53:09.487Z",
                "updated_at": "2020-12-24T10:53:09.569Z"
            },
            {
                "id": 672,
                "name": "product-10-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-3.jpg",
                        "hash": "thumbnail_product_10_3_03d0737c7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.72,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_3_03d0737c7d.jpg"
                    },
                    "large": {
                        "name": "large_product-10-3.jpg",
                        "hash": "large_product_10_3_03d0737c7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 50.92,
                        "path": null,
                        "url": "/uploads/large_product_10_3_03d0737c7d.jpg"
                    },
                    "medium": {
                        "name": "medium_product-10-3.jpg",
                        "hash": "medium_product_10_3_03d0737c7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 33.28,
                        "path": null,
                        "url": "/uploads/medium_product_10_3_03d0737c7d.jpg"
                    },
                    "small": {
                        "name": "small_product-10-3.jpg",
                        "hash": "small_product_10_3_03d0737c7d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 17.84,
                        "path": null,
                        "url": "/uploads/small_product_10_3_03d0737c7d.jpg"
                    }
                },
                "hash": "product_10_3_03d0737c7d",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 44.19,
                "url": "/uploads/product_10_3_03d0737c7d.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:53:09.506Z",
                "updated_at": "2020-12-24T10:53:09.599Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 673,
                "name": "product-10-1-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-1-300x408.jpg",
                        "hash": "thumbnail_product_10_1_300x408_ee78dab46b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.62,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_1_300x408_ee78dab46b.jpg"
                    }
                },
                "hash": "product_10_1_300x408_ee78dab46b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 10.11,
                "url": "/uploads/product_10_1_300x408_ee78dab46b.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:53:26.007Z",
                "updated_at": "2020-12-24T10:53:26.093Z"
            },
            {
                "id": 674,
                "name": "product-10-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-2-300x408.jpg",
                        "hash": "thumbnail_product_10_2_300x408_6cffdb4228",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 1.56,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_2_300x408_6cffdb4228.jpg"
                    }
                },
                "hash": "product_10_2_300x408_6cffdb4228",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.6,
                "url": "/uploads/product_10_2_300x408_6cffdb4228.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:53:26.030Z",
                "updated_at": "2020-12-24T10:53:26.126Z"
            },
            {
                "id": 675,
                "name": "product-10-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-3-300x408.jpg",
                        "hash": "thumbnail_product_10_3_300x408_a9517c4ccf",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.66,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_3_300x408_a9517c4ccf.jpg"
                    }
                },
                "hash": "product_10_3_300x408_a9517c4ccf",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 13.97,
                "url": "/uploads/product_10_3_300x408_a9517c4ccf.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T10:53:26.054Z",
                "updated_at": "2020-12-24T10:53:26.157Z"
            }
        ],
        "category": [
            {
                "id": 3,
                "name": "Shoes",
                "slug": "shoes",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:25:39.408Z",
                "updated_at": "2020-12-24T01:57:14.431Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 105,
        "name": "Short wrap dress",
        "slug": "short-wrap-dress",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 14.99,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:05:56.505Z",
        "updated_at": "2021-01-19T23:23:46.660Z",
        "pictures": [
            {
                "id": 676,
                "name": "product-11-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-1.jpg",
                        "hash": "thumbnail_product_11_1_6074c08e92",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.06,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_1_6074c08e92.jpg"
                    },
                    "large": {
                        "name": "large_product-11-1.jpg",
                        "hash": "large_product_11_1_6074c08e92",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 41,
                        "path": null,
                        "url": "/uploads/large_product_11_1_6074c08e92.jpg"
                    },
                    "medium": {
                        "name": "medium_product-11-1.jpg",
                        "hash": "medium_product_11_1_6074c08e92",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 24.78,
                        "path": null,
                        "url": "/uploads/medium_product_11_1_6074c08e92.jpg"
                    },
                    "small": {
                        "name": "small_product-11-1.jpg",
                        "hash": "small_product_11_1_6074c08e92",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 11.74,
                        "path": null,
                        "url": "/uploads/small_product_11_1_6074c08e92.jpg"
                    }
                },
                "hash": "product_11_1_6074c08e92",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 35.88,
                "url": "/uploads/product_11_1_6074c08e92.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:04:09.653Z",
                "updated_at": "2020-12-24T11:04:09.738Z"
            },
            {
                "id": 677,
                "name": "product-11-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-2.jpg",
                        "hash": "thumbnail_product_11_2_fa9b29a69c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.78,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_2_fa9b29a69c.jpg"
                    },
                    "large": {
                        "name": "large_product-11-2.jpg",
                        "hash": "large_product_11_2_fa9b29a69c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 52.55,
                        "path": null,
                        "url": "/uploads/large_product_11_2_fa9b29a69c.jpg"
                    },
                    "medium": {
                        "name": "medium_product-11-2.jpg",
                        "hash": "medium_product_11_2_fa9b29a69c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 32.61,
                        "path": null,
                        "url": "/uploads/medium_product_11_2_fa9b29a69c.jpg"
                    },
                    "small": {
                        "name": "small_product-11-2.jpg",
                        "hash": "small_product_11_2_fa9b29a69c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 15.72,
                        "path": null,
                        "url": "/uploads/small_product_11_2_fa9b29a69c.jpg"
                    }
                },
                "hash": "product_11_2_fa9b29a69c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 46.61,
                "url": "/uploads/product_11_2_fa9b29a69c.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:04:09.678Z",
                "updated_at": "2020-12-24T11:04:09.769Z"
            },
            {
                "id": 678,
                "name": "product-11-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-3.jpg",
                        "hash": "thumbnail_product_11_3_cdf013acad",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.9,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_3_cdf013acad.jpg"
                    },
                    "large": {
                        "name": "large_product-11-3.jpg",
                        "hash": "large_product_11_3_cdf013acad",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 55.73,
                        "path": null,
                        "url": "/uploads/large_product_11_3_cdf013acad.jpg"
                    },
                    "medium": {
                        "name": "medium_product-11-3.jpg",
                        "hash": "medium_product_11_3_cdf013acad",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 34.46,
                        "path": null,
                        "url": "/uploads/medium_product_11_3_cdf013acad.jpg"
                    },
                    "small": {
                        "name": "small_product-11-3.jpg",
                        "hash": "small_product_11_3_cdf013acad",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 16.74,
                        "path": null,
                        "url": "/uploads/small_product_11_3_cdf013acad.jpg"
                    }
                },
                "hash": "product_11_3_cdf013acad",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 48.25,
                "url": "/uploads/product_11_3_cdf013acad.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:04:09.699Z",
                "updated_at": "2020-12-24T11:04:09.801Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 679,
                "name": "product-11-1-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-1-300x408.jpg",
                        "hash": "thumbnail_product_11_1_300x408_3315022870",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.04,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_1_300x408_3315022870.jpg"
                    }
                },
                "hash": "product_11_1_300x408_3315022870",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 8.11,
                "url": "/uploads/product_11_1_300x408_3315022870.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:04:23.962Z",
                "updated_at": "2020-12-24T11:04:24.049Z"
            },
            {
                "id": 680,
                "name": "product-11-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-2-300x408.jpg",
                        "hash": "thumbnail_product_11_2_300x408_6ffa44abed",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.75,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_2_300x408_6ffa44abed.jpg"
                    }
                },
                "hash": "product_11_2_300x408_6ffa44abed",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 10.72,
                "url": "/uploads/product_11_2_300x408_6ffa44abed.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:04:23.990Z",
                "updated_at": "2020-12-24T11:04:24.084Z"
            },
            {
                "id": 681,
                "name": "product-11-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-3-300x408.jpg",
                        "hash": "thumbnail_product_11_3_300x408_d60deeae95",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.89,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_3_300x408_d60deeae95.jpg"
                    }
                },
                "hash": "product_11_3_300x408_d60deeae95",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.92,
                "url": "/uploads/product_11_3_300x408_d60deeae95.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:04:24.014Z",
                "updated_at": "2020-12-24T11:04:24.118Z"
            }
        ],
        "category": [
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            },
            {
                "id": 5,
                "name": "Clothing",
                "slug": "clothing",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:11.462Z",
                "updated_at": "2020-12-24T01:57:52.117Z"
            }
        ]
    },
    {
        "id": 106,
        "name": "Fashion Sandals",
        "slug": "fashion-sandals",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 24.99,
        "stock": 100,
        "new": true,
        "created_at": "2020-12-24T11:07:35.433Z",
        "updated_at": "2021-01-25T13:22:04.402Z",
        "pictures": [
            {
                "id": 684,
                "name": "product-12-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-1.jpg",
                        "hash": "thumbnail_product_12_1_9844c58035",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.8,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_1_9844c58035.jpg"
                    },
                    "large": {
                        "name": "large_product-12-1.jpg",
                        "hash": "large_product_12_1_9844c58035",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 57.98,
                        "path": null,
                        "url": "/uploads/large_product_12_1_9844c58035.jpg"
                    },
                    "medium": {
                        "name": "medium_product-12-1.jpg",
                        "hash": "medium_product_12_1_9844c58035",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 35.06,
                        "path": null,
                        "url": "/uploads/medium_product_12_1_9844c58035.jpg"
                    },
                    "small": {
                        "name": "small_product-12-1.jpg",
                        "hash": "small_product_12_1_9844c58035",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 17.09,
                        "path": null,
                        "url": "/uploads/small_product_12_1_9844c58035.jpg"
                    }
                },
                "hash": "product_12_1_9844c58035",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 52.63,
                "url": "/uploads/product_12_1_9844c58035.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:06:31.208Z",
                "updated_at": "2020-12-24T11:06:31.295Z"
            },
            {
                "id": 682,
                "name": "product-12-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-2.jpg",
                        "hash": "thumbnail_product_12_2_5ae332d395",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 1.37,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_2_5ae332d395.jpg"
                    },
                    "large": {
                        "name": "large_product-12-2.jpg",
                        "hash": "large_product_12_2_5ae332d395",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 26.11,
                        "path": null,
                        "url": "/uploads/large_product_12_2_5ae332d395.jpg"
                    },
                    "medium": {
                        "name": "medium_product-12-2.jpg",
                        "hash": "medium_product_12_2_5ae332d395",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 16.12,
                        "path": null,
                        "url": "/uploads/medium_product_12_2_5ae332d395.jpg"
                    },
                    "small": {
                        "name": "small_product-12-2.jpg",
                        "hash": "small_product_12_2_5ae332d395",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 7.93,
                        "path": null,
                        "url": "/uploads/small_product_12_2_5ae332d395.jpg"
                    }
                },
                "hash": "product_12_2_5ae332d395",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 24.81,
                "url": "/uploads/product_12_2_5ae332d395.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:06:31.171Z",
                "updated_at": "2020-12-24T11:06:31.240Z"
            },
            {
                "id": 683,
                "name": "product-12-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 1088,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-3.jpg",
                        "hash": "thumbnail_product_12_3_b629f4b2af",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.69,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_3_b629f4b2af.jpg"
                    },
                    "large": {
                        "name": "large_product-12-3.jpg",
                        "hash": "large_product_12_3_b629f4b2af",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 735,
                        "height": 1000,
                        "size": 76.73,
                        "path": null,
                        "url": "/uploads/large_product_12_3_b629f4b2af.jpg"
                    },
                    "medium": {
                        "name": "medium_product-12-3.jpg",
                        "hash": "medium_product_12_3_b629f4b2af",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 551,
                        "height": 750,
                        "size": 47.38,
                        "path": null,
                        "url": "/uploads/medium_product_12_3_b629f4b2af.jpg"
                    },
                    "small": {
                        "name": "small_product-12-3.jpg",
                        "hash": "small_product_12_3_b629f4b2af",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 368,
                        "height": 500,
                        "size": 22.41,
                        "path": null,
                        "url": "/uploads/small_product_12_3_b629f4b2af.jpg"
                    }
                },
                "hash": "product_12_3_b629f4b2af",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 70.59,
                "url": "/uploads/product_12_3_b629f4b2af.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:06:31.191Z",
                "updated_at": "2020-12-24T11:06:31.266Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 685,
                "name": "product-12-1-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-1-300x408.jpg",
                        "hash": "thumbnail_product_12_1_300x408_f2de20153a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 2.81,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_1_300x408_f2de20153a.jpg"
                    }
                },
                "hash": "product_12_1_300x408_f2de20153a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.5,
                "url": "/uploads/product_12_1_300x408_f2de20153a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:06:43.802Z",
                "updated_at": "2020-12-24T11:06:43.888Z"
            },
            {
                "id": 687,
                "name": "product-12-2-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-2-300x408.jpg",
                        "hash": "thumbnail_product_12_2_300x408_040de8318b",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 1.37,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_2_300x408_040de8318b.jpg"
                    }
                },
                "hash": "product_12_2_300x408_040de8318b",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 5.39,
                "url": "/uploads/product_12_2_300x408_040de8318b.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:06:43.849Z",
                "updated_at": "2020-12-24T11:06:43.950Z"
            },
            {
                "id": 686,
                "name": "product-12-3-300x408.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 408,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-3-300x408.jpg",
                        "hash": "thumbnail_product_12_3_300x408_1b467e9669",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 115,
                        "height": 156,
                        "size": 3.67,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_3_300x408_1b467e9669.jpg"
                    }
                },
                "hash": "product_12_3_300x408_1b467e9669",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 16.66,
                "url": "/uploads/product_12_3_300x408_1b467e9669.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:06:43.826Z",
                "updated_at": "2020-12-24T11:06:43.922Z"
            }
        ],
        "category": [
            {
                "id": 3,
                "name": "Shoes",
                "slug": "shoes",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:25:39.408Z",
                "updated_at": "2020-12-24T01:57:14.431Z"
            },
            {
                "id": 1,
                "name": "Women",
                "slug": "women",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:24:42.894Z",
                "updated_at": "2020-12-24T01:56:51.418Z"
            }
        ]
    },
    {
        "id": 107,
        "name": "2-Seater",
        "slug": "2-seater",
        "short_desc": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing. Sed lectus.",
        "price": 248,
        "stock": 0,
        "new": null,
        "created_at": "2020-12-24T11:10:54.776Z",
        "updated_at": "2021-01-14T02:04:44.357Z",
        "pictures": [
            {
                "id": 689,
                "name": "product-1-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-1.jpg",
                        "hash": "thumbnail_product_1_1_e4d26c1a1a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.3,
                        "path": null,
                        "url": "/uploads/thumbnail_product_1_1_e4d26c1a1a.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-1.jpg",
                        "hash": "medium_product_1_1_e4d26c1a1a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 24.22,
                        "path": null,
                        "url": "/uploads/medium_product_1_1_e4d26c1a1a.jpg"
                    },
                    "small": {
                        "name": "small_product-1-1.jpg",
                        "hash": "small_product_1_1_e4d26c1a1a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 12.8,
                        "path": null,
                        "url": "/uploads/small_product_1_1_e4d26c1a1a.jpg"
                    }
                },
                "hash": "product_1_1_e4d26c1a1a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 22.2,
                "url": "/uploads/product_1_1_e4d26c1a1a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:09:16.867Z",
                "updated_at": "2020-12-24T11:09:16.938Z"
            },
            {
                "id": 688,
                "name": "product-1-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-2.jpg",
                        "hash": "thumbnail_product_1_2_a7c10bc1b6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.35,
                        "path": null,
                        "url": "/uploads/thumbnail_product_1_2_a7c10bc1b6.jpg"
                    },
                    "medium": {
                        "name": "medium_product-1-2.jpg",
                        "hash": "medium_product_1_2_a7c10bc1b6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 26.51,
                        "path": null,
                        "url": "/uploads/medium_product_1_2_a7c10bc1b6.jpg"
                    },
                    "small": {
                        "name": "small_product-1-2.jpg",
                        "hash": "small_product_1_2_a7c10bc1b6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 14.31,
                        "path": null,
                        "url": "/uploads/small_product_1_2_a7c10bc1b6.jpg"
                    }
                },
                "hash": "product_1_2_a7c10bc1b6",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 25.54,
                "url": "/uploads/product_1_2_a7c10bc1b6.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:09:16.844Z",
                "updated_at": "2020-12-24T11:09:16.902Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 690,
                "name": "product-1-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-1-300x300.jpg",
                        "hash": "thumbnail_product_1_1_300x300_ec128f72cf",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.31,
                        "path": null,
                        "url": "/uploads/thumbnail_product_1_1_300x300_ec128f72cf.jpg"
                    }
                },
                "hash": "product_1_1_300x300_ec128f72cf",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.97,
                "url": "/uploads/product_1_1_300x300_ec128f72cf.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:09:32.996Z",
                "updated_at": "2020-12-24T11:09:33.056Z"
            },
            {
                "id": 691,
                "name": "product-1-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-1-2-300x300.jpg",
                        "hash": "thumbnail_product_1_2_300x300_d265cc4cd6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.35,
                        "path": null,
                        "url": "/uploads/thumbnail_product_1_2_300x300_d265cc4cd6.jpg"
                    }
                },
                "hash": "product_1_2_300x300_d265cc4cd6",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 5.67,
                "url": "/uploads/product_1_2_300x300_d265cc4cd6.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:09:33.019Z",
                "updated_at": "2020-12-24T11:09:33.089Z"
            }
        ],
        "category": [
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            }
        ]
    },
    {
        "id": 108,
        "name": "Block Side Table/Trolley",
        "slug": "block-side-tabletrolley",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 210,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:15:19.022Z",
        "updated_at": "2021-01-22T04:14:46.140Z",
        "pictures": [
            {
                "id": 693,
                "name": "product-2-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-1.jpg",
                        "hash": "thumbnail_product_2_1_5762ebbcfa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.99,
                        "path": null,
                        "url": "/uploads/thumbnail_product_2_1_5762ebbcfa.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-1.jpg",
                        "hash": "medium_product_2_1_5762ebbcfa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 17,
                        "path": null,
                        "url": "/uploads/medium_product_2_1_5762ebbcfa.jpg"
                    },
                    "small": {
                        "name": "small_product-2-1.jpg",
                        "hash": "small_product_2_1_5762ebbcfa",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 9.48,
                        "path": null,
                        "url": "/uploads/small_product_2_1_5762ebbcfa.jpg"
                    }
                },
                "hash": "product_2_1_5762ebbcfa",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 14.73,
                "url": "/uploads/product_2_1_5762ebbcfa.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:11:47.756Z",
                "updated_at": "2020-12-24T11:11:47.816Z"
            },
            {
                "id": 692,
                "name": "product-2-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-2.jpg",
                        "hash": "thumbnail_product_2_2_fd5b139dce",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.57,
                        "path": null,
                        "url": "/uploads/thumbnail_product_2_2_fd5b139dce.jpg"
                    },
                    "medium": {
                        "name": "medium_product-2-2.jpg",
                        "hash": "medium_product_2_2_fd5b139dce",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 21.42,
                        "path": null,
                        "url": "/uploads/medium_product_2_2_fd5b139dce.jpg"
                    },
                    "small": {
                        "name": "small_product-2-2.jpg",
                        "hash": "small_product_2_2_fd5b139dce",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 11.72,
                        "path": null,
                        "url": "/uploads/small_product_2_2_fd5b139dce.jpg"
                    }
                },
                "hash": "product_2_2_fd5b139dce",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 18.37,
                "url": "/uploads/product_2_2_fd5b139dce.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:11:47.731Z",
                "updated_at": "2020-12-24T11:11:47.788Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 694,
                "name": "product-2-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-1-300x300.jpg",
                        "hash": "thumbnail_product_2_1_300x300_1cbb2b1986",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.01,
                        "path": null,
                        "url": "/uploads/thumbnail_product_2_1_300x300_1cbb2b1986.jpg"
                    }
                },
                "hash": "product_2_1_300x300_1cbb2b1986",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.21,
                "url": "/uploads/product_2_1_300x300_1cbb2b1986.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:12:00.685Z",
                "updated_at": "2020-12-24T11:12:00.740Z"
            },
            {
                "id": 695,
                "name": "product-2-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-2-2-300x300.jpg",
                        "hash": "thumbnail_product_2_2_300x300_798eabaee1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.59,
                        "path": null,
                        "url": "/uploads/thumbnail_product_2_2_300x300_798eabaee1.jpg"
                    }
                },
                "hash": "product_2_2_300x300_798eabaee1",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.88,
                "url": "/uploads/product_2_2_300x300_798eabaee1.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:12:00.706Z",
                "updated_at": "2020-12-24T11:12:00.772Z"
            }
        ],
        "category": [
            {
                "id": 8,
                "name": "Coffee & Tables",
                "slug": "coffee-and-tables",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:27:15.507Z",
                "updated_at": "2020-12-24T01:59:02.713Z"
            },
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            },
            {
                "id": 39,
                "name": "Tables",
                "slug": "tables",
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T04:02:12.537Z",
                "updated_at": "2020-12-24T04:02:12.582Z"
            }
        ]
    },
    {
        "id": 109,
        "name": "Butler Stool Ladder",
        "slug": "butler-stool-ladder",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 25,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:20:39.864Z",
        "updated_at": "2021-01-08T08:39:22.638Z",
        "pictures": [
            {
                "id": 696,
                "name": "product-3-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-1.jpg",
                        "hash": "thumbnail_product_3_1_c9bb2bcafd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.64,
                        "path": null,
                        "url": "/uploads/thumbnail_product_3_1_c9bb2bcafd.jpg"
                    },
                    "medium": {
                        "name": "medium_product-3-1.jpg",
                        "hash": "medium_product_3_1_c9bb2bcafd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 26.44,
                        "path": null,
                        "url": "/uploads/medium_product_3_1_c9bb2bcafd.jpg"
                    },
                    "small": {
                        "name": "small_product-3-1.jpg",
                        "hash": "small_product_3_1_c9bb2bcafd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 13.99,
                        "path": null,
                        "url": "/uploads/small_product_3_1_c9bb2bcafd.jpg"
                    }
                },
                "hash": "product_3_1_c9bb2bcafd",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 23.89,
                "url": "/uploads/product_3_1_c9bb2bcafd.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:16:57.261Z",
                "updated_at": "2020-12-24T11:16:57.319Z"
            },
            {
                "id": 697,
                "name": "product-3-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-2.jpg",
                        "hash": "thumbnail_product_3_2_8b3922b75c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.19,
                        "path": null,
                        "url": "/uploads/thumbnail_product_3_2_8b3922b75c.jpg"
                    },
                    "medium": {
                        "name": "medium_product-3-2.jpg",
                        "hash": "medium_product_3_2_8b3922b75c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 24.13,
                        "path": null,
                        "url": "/uploads/medium_product_3_2_8b3922b75c.jpg"
                    },
                    "small": {
                        "name": "small_product-3-2.jpg",
                        "hash": "small_product_3_2_8b3922b75c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 12.25,
                        "path": null,
                        "url": "/uploads/small_product_3_2_8b3922b75c.jpg"
                    }
                },
                "hash": "product_3_2_8b3922b75c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 22.27,
                "url": "/uploads/product_3_2_8b3922b75c.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:16:57.286Z",
                "updated_at": "2020-12-24T11:16:57.347Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 698,
                "name": "product-3-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-1-300x300.jpg",
                        "hash": "thumbnail_product_3_1_300x300_a6a525d4b9",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.68,
                        "path": null,
                        "url": "/uploads/thumbnail_product_3_1_300x300_a6a525d4b9.jpg"
                    }
                },
                "hash": "product_3_1_300x300_a6a525d4b9",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 6.08,
                "url": "/uploads/product_3_1_300x300_a6a525d4b9.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:17:06.864Z",
                "updated_at": "2020-12-24T11:17:06.915Z"
            },
            {
                "id": 699,
                "name": "product-3-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-3-2-300x300.jpg",
                        "hash": "thumbnail_product_3_2_300x300_7ef429113e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.21,
                        "path": null,
                        "url": "/uploads/thumbnail_product_3_2_300x300_7ef429113e.jpg"
                    }
                },
                "hash": "product_3_2_300x300_7ef429113e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.98,
                "url": "/uploads/product_3_2_300x300_7ef429113e.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:17:06.883Z",
                "updated_at": "2020-12-24T11:17:06.948Z"
            }
        ],
        "category": [
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            }
        ]
    },
    {
        "id": 110,
        "name": "Can 2-Seater Sofa",
        "slug": "can-2-seater-sofa",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 60,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:22:43.045Z",
        "updated_at": "2021-01-08T13:27:55.841Z",
        "pictures": [
            {
                "id": 700,
                "name": "product-4-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-1.jpg",
                        "hash": "thumbnail_product_4_1_eb29eb2553",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.88,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_1_eb29eb2553.jpg"
                    },
                    "medium": {
                        "name": "medium_product-4-1.jpg",
                        "hash": "medium_product_4_1_eb29eb2553",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 19.57,
                        "path": null,
                        "url": "/uploads/medium_product_4_1_eb29eb2553.jpg"
                    },
                    "small": {
                        "name": "small_product-4-1.jpg",
                        "hash": "small_product_4_1_eb29eb2553",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 10.38,
                        "path": null,
                        "url": "/uploads/small_product_4_1_eb29eb2553.jpg"
                    }
                },
                "hash": "product_4_1_eb29eb2553",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 17.27,
                "url": "/uploads/product_4_1_eb29eb2553.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:21:19.421Z",
                "updated_at": "2020-12-24T11:21:19.477Z"
            },
            {
                "id": 701,
                "name": "product-4-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-2.jpg",
                        "hash": "thumbnail_product_4_2_fc5117a10c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.08,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_2_fc5117a10c.jpg"
                    },
                    "medium": {
                        "name": "medium_product-4-2.jpg",
                        "hash": "medium_product_4_2_fc5117a10c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 20.44,
                        "path": null,
                        "url": "/uploads/medium_product_4_2_fc5117a10c.jpg"
                    },
                    "small": {
                        "name": "small_product-4-2.jpg",
                        "hash": "small_product_4_2_fc5117a10c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 11.21,
                        "path": null,
                        "url": "/uploads/small_product_4_2_fc5117a10c.jpg"
                    }
                },
                "hash": "product_4_2_fc5117a10c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 18.19,
                "url": "/uploads/product_4_2_fc5117a10c.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:21:19.444Z",
                "updated_at": "2020-12-24T11:21:19.506Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 703,
                "name": "product-4-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-1-300x300.jpg",
                        "hash": "thumbnail_product_4_1_300x300_aec4741c63",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.89,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_1_300x300_aec4741c63.jpg"
                    }
                },
                "hash": "product_4_1_300x300_aec4741c63",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.14,
                "url": "/uploads/product_4_1_300x300_aec4741c63.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:21:29.307Z",
                "updated_at": "2020-12-24T11:21:29.374Z"
            },
            {
                "id": 702,
                "name": "product-4-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-4-2-300x300.jpg",
                        "hash": "thumbnail_product_4_2_300x300_ec63a5f054",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.09,
                        "path": null,
                        "url": "/uploads/thumbnail_product_4_2_300x300_ec63a5f054.jpg"
                    }
                },
                "hash": "product_4_2_300x300_ec63a5f054",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.53,
                "url": "/uploads/product_4_2_300x300_ec63a5f054.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:21:29.285Z",
                "updated_at": "2020-12-24T11:21:29.345Z"
            }
        ],
        "category": [
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            }
        ]
    },
    {
        "id": 111,
        "name": "Roots Sofa Bed",
        "slug": "roots-sofa-bed",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 449,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:24:47.722Z",
        "updated_at": "2020-12-29T23:26:15.448Z",
        "pictures": [
            {
                "id": 704,
                "name": "product-11-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-1.jpg",
                        "hash": "thumbnail_product_11_1_9a78606f40",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.04,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_1_9a78606f40.jpg"
                    },
                    "medium": {
                        "name": "medium_product-11-1.jpg",
                        "hash": "medium_product_11_1_9a78606f40",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 20.36,
                        "path": null,
                        "url": "/uploads/medium_product_11_1_9a78606f40.jpg"
                    },
                    "small": {
                        "name": "small_product-11-1.jpg",
                        "hash": "small_product_11_1_9a78606f40",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 11.01,
                        "path": null,
                        "url": "/uploads/small_product_11_1_9a78606f40.jpg"
                    }
                },
                "hash": "product_11_1_9a78606f40",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 17.93,
                "url": "/uploads/product_11_1_9a78606f40.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:23:33.108Z",
                "updated_at": "2020-12-24T11:23:33.168Z"
            },
            {
                "id": 705,
                "name": "product-11-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-2.jpg",
                        "hash": "thumbnail_product_11_2_6edd00078a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.68,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_2_6edd00078a.jpg"
                    },
                    "medium": {
                        "name": "medium_product-11-2.jpg",
                        "hash": "medium_product_11_2_6edd00078a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 17.44,
                        "path": null,
                        "url": "/uploads/medium_product_11_2_6edd00078a.jpg"
                    },
                    "small": {
                        "name": "small_product-11-2.jpg",
                        "hash": "small_product_11_2_6edd00078a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 9.3,
                        "path": null,
                        "url": "/uploads/small_product_11_2_6edd00078a.jpg"
                    }
                },
                "hash": "product_11_2_6edd00078a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 15.26,
                "url": "/uploads/product_11_2_6edd00078a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:23:33.133Z",
                "updated_at": "2020-12-24T11:23:33.199Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 706,
                "name": "product-11-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-1-300x300.jpg",
                        "hash": "thumbnail_product_11_1_300x300_574a1b1d0e",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.04,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_1_300x300_574a1b1d0e.jpg"
                    }
                },
                "hash": "product_11_1_300x300_574a1b1d0e",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.59,
                "url": "/uploads/product_11_1_300x300_574a1b1d0e.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:23:47.737Z",
                "updated_at": "2020-12-24T11:23:47.797Z"
            },
            {
                "id": 707,
                "name": "product-11-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-11-2-300x300.jpg",
                        "hash": "thumbnail_product_11_2_300x300_8f906c2dcd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.74,
                        "path": null,
                        "url": "/uploads/thumbnail_product_11_2_300x300_8f906c2dcd.jpg"
                    }
                },
                "hash": "product_11_2_300x300_8f906c2dcd",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 3.77,
                "url": "/uploads/product_11_2_300x300_8f906c2dcd.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:23:47.761Z",
                "updated_at": "2020-12-24T11:23:47.828Z"
            }
        ],
        "category": [
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            }
        ]
    },
    {
        "id": 112,
        "name": "Carronade Table Lamp",
        "slug": "carronade-table-lamp",
        "short_desc": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing. Sed lectus.",
        "price": 130,
        "stock": 100,
        "new": true,
        "created_at": "2020-12-24T11:29:50.953Z",
        "updated_at": "2021-01-14T00:27:42.637Z",
        "pictures": [
            {
                "id": 709,
                "name": "product-6-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-1.jpg",
                        "hash": "thumbnail_product_6_1_c476bd5543",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.64,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_1_c476bd5543.jpg"
                    },
                    "medium": {
                        "name": "medium_product-6-1.jpg",
                        "hash": "medium_product_6_1_c476bd5543",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 14.96,
                        "path": null,
                        "url": "/uploads/medium_product_6_1_c476bd5543.jpg"
                    },
                    "small": {
                        "name": "small_product-6-1.jpg",
                        "hash": "small_product_6_1_c476bd5543",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 8.15,
                        "path": null,
                        "url": "/uploads/small_product_6_1_c476bd5543.jpg"
                    }
                },
                "hash": "product_6_1_c476bd5543",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 13.53,
                "url": "/uploads/product_6_1_c476bd5543.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:26:00.602Z",
                "updated_at": "2020-12-24T11:26:00.668Z"
            },
            {
                "id": 708,
                "name": "product-6-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-2.jpg",
                        "hash": "thumbnail_product_6_2_603d3d65e8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.77,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_2_603d3d65e8.jpg"
                    },
                    "medium": {
                        "name": "medium_product-6-2.jpg",
                        "hash": "medium_product_6_2_603d3d65e8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 15.87,
                        "path": null,
                        "url": "/uploads/medium_product_6_2_603d3d65e8.jpg"
                    },
                    "small": {
                        "name": "small_product-6-2.jpg",
                        "hash": "small_product_6_2_603d3d65e8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 8.6,
                        "path": null,
                        "url": "/uploads/small_product_6_2_603d3d65e8.jpg"
                    }
                },
                "hash": "product_6_2_603d3d65e8",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 14.22,
                "url": "/uploads/product_6_2_603d3d65e8.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:26:00.576Z",
                "updated_at": "2020-12-24T11:26:00.637Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 710,
                "name": "product-6-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-1-300x300.jpg",
                        "hash": "thumbnail_product_6_1_300x300_aea55d68e9",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.69,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_1_300x300_aea55d68e9.jpg"
                    }
                },
                "hash": "product_6_1_300x300_aea55d68e9",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 3.49,
                "url": "/uploads/product_6_1_300x300_aea55d68e9.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:26:11.070Z",
                "updated_at": "2020-12-24T11:26:11.136Z"
            },
            {
                "id": 711,
                "name": "product-6-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-6-2-300x300.jpg",
                        "hash": "thumbnail_product_6_2_300x300_76886659e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.79,
                        "path": null,
                        "url": "/uploads/thumbnail_product_6_2_300x300_76886659e2.jpg"
                    }
                },
                "hash": "product_6_2_300x300_76886659e2",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 3.73,
                "url": "/uploads/product_6_2_300x300_76886659e2.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:26:11.094Z",
                "updated_at": "2020-12-24T11:26:11.166Z"
            }
        ],
        "category": [
            {
                "id": 11,
                "name": "Decoration",
                "slug": "decoration",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:28:06.841Z",
                "updated_at": "2020-12-24T01:59:58.491Z"
            },
            {
                "id": 9,
                "name": "Electronics",
                "slug": "electronics",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:27:29.618Z",
                "updated_at": "2020-12-24T01:59:28.968Z"
            },
            {
                "id": 10,
                "name": "Lighting",
                "slug": "lighting",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:27:46.112Z",
                "updated_at": "2020-12-24T01:59:42.794Z"
            }
        ]
    },
    {
        "id": 113,
        "name": "Cushion Set 3 Pieces",
        "slug": "cushion-set-3-pieces",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 199,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:33:29.781Z",
        "updated_at": "2021-01-08T13:28:41.220Z",
        "pictures": [
            {
                "id": 712,
                "name": "product-7-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-1.jpg",
                        "hash": "thumbnail_product_7_1_f30fe5e8e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.27,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_1_f30fe5e8e2.jpg"
                    },
                    "medium": {
                        "name": "medium_product-7-1.jpg",
                        "hash": "medium_product_7_1_f30fe5e8e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 39.88,
                        "path": null,
                        "url": "/uploads/medium_product_7_1_f30fe5e8e2.jpg"
                    },
                    "small": {
                        "name": "small_product-7-1.jpg",
                        "hash": "small_product_7_1_f30fe5e8e2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 21.24,
                        "path": null,
                        "url": "/uploads/small_product_7_1_f30fe5e8e2.jpg"
                    }
                },
                "hash": "product_7_1_f30fe5e8e2",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 35.19,
                "url": "/uploads/product_7_1_f30fe5e8e2.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:30:28.694Z",
                "updated_at": "2020-12-24T11:30:28.759Z"
            },
            {
                "id": 713,
                "name": "product-7-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-2.jpg",
                        "hash": "thumbnail_product_7_2_1f94768f88",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.05,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_2_1f94768f88.jpg"
                    },
                    "medium": {
                        "name": "medium_product-7-2.jpg",
                        "hash": "medium_product_7_2_1f94768f88",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 20.27,
                        "path": null,
                        "url": "/uploads/medium_product_7_2_1f94768f88.jpg"
                    },
                    "small": {
                        "name": "small_product-7-2.jpg",
                        "hash": "small_product_7_2_1f94768f88",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 10.96,
                        "path": null,
                        "url": "/uploads/small_product_7_2_1f94768f88.jpg"
                    }
                },
                "hash": "product_7_2_1f94768f88",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 17.71,
                "url": "/uploads/product_7_2_1f94768f88.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:30:28.721Z",
                "updated_at": "2020-12-24T11:30:28.792Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 715,
                "name": "product-7-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-1-300x300.jpg",
                        "hash": "thumbnail_product_7_1_300x300_298b73e706",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.29,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_1_300x300_298b73e706.jpg"
                    }
                },
                "hash": "product_7_1_300x300_298b73e706",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 8.47,
                "url": "/uploads/product_7_1_300x300_298b73e706.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:30:40.607Z",
                "updated_at": "2020-12-24T11:30:40.673Z"
            },
            {
                "id": 714,
                "name": "product-7-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-7-2-300x300.jpg",
                        "hash": "thumbnail_product_7_2_300x300_6e6c2d02d3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.08,
                        "path": null,
                        "url": "/uploads/thumbnail_product_7_2_300x300_6e6c2d02d3.jpg"
                    }
                },
                "hash": "product_7_2_300x300_6e6c2d02d3",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.57,
                "url": "/uploads/product_7_2_300x300_6e6c2d02d3.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:30:40.582Z",
                "updated_at": "2020-12-24T11:30:40.641Z"
            }
        ],
        "category": [
            {
                "id": 11,
                "name": "Decoration",
                "slug": "decoration",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:28:06.841Z",
                "updated_at": "2020-12-24T01:59:58.491Z"
            },
            {
                "id": 12,
                "name": "Beds",
                "slug": "beds",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-18T06:46:56.197Z",
                "updated_at": "2020-12-24T02:00:13.871Z"
            }
        ]
    },
    {
        "id": 114,
        "name": "Flow Slim Armchair",
        "slug": "flow-slim-armchair",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 97,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:35:43.001Z",
        "updated_at": "2021-01-11T05:39:50.985Z",
        "pictures": [
            {
                "id": 717,
                "name": "product-8-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-1.jpg",
                        "hash": "thumbnail_product_8_1_7d631e8cf3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.46,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_1_7d631e8cf3.jpg"
                    },
                    "medium": {
                        "name": "medium_product-8-1.jpg",
                        "hash": "medium_product_8_1_7d631e8cf3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 23.69,
                        "path": null,
                        "url": "/uploads/medium_product_8_1_7d631e8cf3.jpg"
                    },
                    "small": {
                        "name": "small_product-8-1.jpg",
                        "hash": "small_product_8_1_7d631e8cf3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 12.96,
                        "path": null,
                        "url": "/uploads/small_product_8_1_7d631e8cf3.jpg"
                    }
                },
                "hash": "product_8_1_7d631e8cf3",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 20.59,
                "url": "/uploads/product_8_1_7d631e8cf3.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:34:19.508Z",
                "updated_at": "2020-12-24T11:34:19.590Z"
            },
            {
                "id": 718,
                "name": "product-8-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-2.jpg",
                        "hash": "thumbnail_product_8_2_b5fbed36e9",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.4,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_2_b5fbed36e9.jpg"
                    },
                    "medium": {
                        "name": "medium_product-8-2.jpg",
                        "hash": "medium_product_8_2_b5fbed36e9",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 44.49,
                        "path": null,
                        "url": "/uploads/medium_product_8_2_b5fbed36e9.jpg"
                    },
                    "small": {
                        "name": "small_product-8-2.jpg",
                        "hash": "small_product_8_2_b5fbed36e9",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 19.59,
                        "path": null,
                        "url": "/uploads/small_product_8_2_b5fbed36e9.jpg"
                    }
                },
                "hash": "product_8_2_b5fbed36e9",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 42.29,
                "url": "/uploads/product_8_2_b5fbed36e9.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:34:19.528Z",
                "updated_at": "2020-12-24T11:34:19.618Z"
            },
            {
                "id": 716,
                "name": "product-8-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-3.jpg",
                        "hash": "thumbnail_product_8_3_495a8c7f79",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.4,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_3_495a8c7f79.jpg"
                    },
                    "medium": {
                        "name": "medium_product-8-3.jpg",
                        "hash": "medium_product_8_3_495a8c7f79",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 43.97,
                        "path": null,
                        "url": "/uploads/medium_product_8_3_495a8c7f79.jpg"
                    },
                    "small": {
                        "name": "small_product-8-3.jpg",
                        "hash": "small_product_8_3_495a8c7f79",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 19.17,
                        "path": null,
                        "url": "/uploads/small_product_8_3_495a8c7f79.jpg"
                    }
                },
                "hash": "product_8_3_495a8c7f79",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 41.32,
                "url": "/uploads/product_8_3_495a8c7f79.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:34:19.478Z",
                "updated_at": "2020-12-24T11:34:19.561Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 719,
                "name": "product-8-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-1-300x300.jpg",
                        "hash": "thumbnail_product_8_1_300x300_ffd8a22d4a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.51,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_1_300x300_ffd8a22d4a.jpg"
                    }
                },
                "hash": "product_8_1_300x300_ffd8a22d4a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 5.48,
                "url": "/uploads/product_8_1_300x300_ffd8a22d4a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:34:34.646Z",
                "updated_at": "2020-12-24T11:34:34.728Z"
            },
            {
                "id": 720,
                "name": "product-8-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-2-300x300.jpg",
                        "hash": "thumbnail_product_8_2_300x300_aef1526120",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.43,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_2_300x300_aef1526120.jpg"
                    }
                },
                "hash": "product_8_2_300x300_aef1526120",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 6.17,
                "url": "/uploads/product_8_2_300x300_aef1526120.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:34:34.670Z",
                "updated_at": "2020-12-24T11:34:34.759Z"
            },
            {
                "id": 721,
                "name": "product-8-3-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-8-3-300x300.jpg",
                        "hash": "thumbnail_product_8_3_300x300_cf0af19cb3",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.44,
                        "path": null,
                        "url": "/uploads/thumbnail_product_8_3_300x300_cf0af19cb3.jpg"
                    }
                },
                "hash": "product_8_3_300x300_cf0af19cb3",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 6.26,
                "url": "/uploads/product_8_3_300x300_cf0af19cb3.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:34:34.700Z",
                "updated_at": "2020-12-24T11:34:34.792Z"
            }
        ],
        "category": [
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            },
            {
                "id": 13,
                "name": "Armchairs & Chaises",
                "slug": "armchairs-and-chaises",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-18T06:54:20.047Z",
                "updated_at": "2020-12-24T02:00:45.265Z"
            }
        ]
    },
    {
        "id": 115,
        "name": "Foldable Tray Table",
        "slug": "foldable-tray-table",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 308,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:37:50.351Z",
        "updated_at": "2021-01-08T13:29:20.296Z",
        "pictures": [
            {
                "id": 723,
                "name": "product-9-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-1.jpg",
                        "hash": "thumbnail_product_9_1_d8728d982a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.24,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_1_d8728d982a.jpg"
                    },
                    "medium": {
                        "name": "medium_product-9-1.jpg",
                        "hash": "medium_product_9_1_d8728d982a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 26.3,
                        "path": null,
                        "url": "/uploads/medium_product_9_1_d8728d982a.jpg"
                    },
                    "small": {
                        "name": "small_product-9-1.jpg",
                        "hash": "small_product_9_1_d8728d982a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 13.38,
                        "path": null,
                        "url": "/uploads/small_product_9_1_d8728d982a.jpg"
                    }
                },
                "hash": "product_9_1_d8728d982a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 24.33,
                "url": "/uploads/product_9_1_d8728d982a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:36:31.441Z",
                "updated_at": "2020-12-24T11:36:31.510Z"
            },
            {
                "id": 722,
                "name": "product-9-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-2.jpg",
                        "hash": "thumbnail_product_9_2_1584c6067c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.18,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_2_1584c6067c.jpg"
                    },
                    "medium": {
                        "name": "medium_product-9-2.jpg",
                        "hash": "medium_product_9_2_1584c6067c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 18.47,
                        "path": null,
                        "url": "/uploads/medium_product_9_2_1584c6067c.jpg"
                    },
                    "small": {
                        "name": "small_product-9-2.jpg",
                        "hash": "small_product_9_2_1584c6067c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 10.22,
                        "path": null,
                        "url": "/uploads/small_product_9_2_1584c6067c.jpg"
                    }
                },
                "hash": "product_9_2_1584c6067c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 14.76,
                "url": "/uploads/product_9_2_1584c6067c.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:36:31.416Z",
                "updated_at": "2020-12-24T11:36:31.478Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 724,
                "name": "product-9-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-1-300x300.jpg",
                        "hash": "thumbnail_product_9_1_300x300_6a1e6d817c",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.22,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_1_300x300_6a1e6d817c.jpg"
                    }
                },
                "hash": "product_9_1_300x300_6a1e6d817c",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 5.17,
                "url": "/uploads/product_9_1_300x300_6a1e6d817c.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:36:47.698Z",
                "updated_at": "2020-12-24T11:36:47.762Z"
            },
            {
                "id": 725,
                "name": "product-9-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-9-2-300x300.jpg",
                        "hash": "thumbnail_product_9_2_300x300_1b33d80bc7",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.21,
                        "path": null,
                        "url": "/uploads/thumbnail_product_9_2_300x300_1b33d80bc7.jpg"
                    }
                },
                "hash": "product_9_2_300x300_1b33d80bc7",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.16,
                "url": "/uploads/product_9_2_300x300_1b33d80bc7.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:36:47.725Z",
                "updated_at": "2020-12-24T11:36:47.793Z"
            }
        ],
        "category": [
            {
                "id": 11,
                "name": "Decoration",
                "slug": "decoration",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:28:06.841Z",
                "updated_at": "2020-12-24T01:59:58.491Z"
            },
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            }
        ]
    },
    {
        "id": 116,
        "name": "Garden Armchair",
        "slug": "garden-armchair",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 94,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:40:05.229Z",
        "updated_at": "2021-01-08T10:59:39.066Z",
        "pictures": [
            {
                "id": 726,
                "name": "product-10-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-2.jpg",
                        "hash": "thumbnail_product_10_2_0bb52f8b5a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.83,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_2_0bb52f8b5a.jpg"
                    },
                    "medium": {
                        "name": "medium_product-10-2.jpg",
                        "hash": "medium_product_10_2_0bb52f8b5a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 15.05,
                        "path": null,
                        "url": "/uploads/medium_product_10_2_0bb52f8b5a.jpg"
                    },
                    "small": {
                        "name": "small_product-10-2.jpg",
                        "hash": "small_product_10_2_0bb52f8b5a",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 8.62,
                        "path": null,
                        "url": "/uploads/small_product_10_2_0bb52f8b5a.jpg"
                    }
                },
                "hash": "product_10_2_0bb52f8b5a",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 13.04,
                "url": "/uploads/product_10_2_0bb52f8b5a.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:38:29.395Z",
                "updated_at": "2020-12-24T11:38:29.453Z"
            },
            {
                "id": 727,
                "name": "product-10-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-1.jpg",
                        "hash": "thumbnail_product_10_1_6a2a4ed0cd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.59,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_1_6a2a4ed0cd.jpg"
                    },
                    "medium": {
                        "name": "medium_product-10-1.jpg",
                        "hash": "medium_product_10_1_6a2a4ed0cd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 19.73,
                        "path": null,
                        "url": "/uploads/medium_product_10_1_6a2a4ed0cd.jpg"
                    },
                    "small": {
                        "name": "small_product-10-1.jpg",
                        "hash": "small_product_10_1_6a2a4ed0cd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 11.28,
                        "path": null,
                        "url": "/uploads/small_product_10_1_6a2a4ed0cd.jpg"
                    }
                },
                "hash": "product_10_1_6a2a4ed0cd",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 16.32,
                "url": "/uploads/product_10_1_6a2a4ed0cd.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:38:29.419Z",
                "updated_at": "2020-12-24T11:38:29.482Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 728,
                "name": "product-10-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-2-300x300.jpg",
                        "hash": "thumbnail_product_10_2_300x300_4ef184c8b8",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.84,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_2_300x300_4ef184c8b8.jpg"
                    }
                },
                "hash": "product_10_2_300x300_4ef184c8b8",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 3.58,
                "url": "/uploads/product_10_2_300x300_4ef184c8b8.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:38:45.760Z",
                "updated_at": "2020-12-24T11:38:45.811Z"
            },
            {
                "id": 729,
                "name": "product-10-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-10-1-300x300.jpg",
                        "hash": "thumbnail_product_10_1_300x300_76e829e2ec",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.6,
                        "path": null,
                        "url": "/uploads/thumbnail_product_10_1_300x300_76e829e2ec.jpg"
                    }
                },
                "hash": "product_10_1_300x300_76e829e2ec",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.76,
                "url": "/uploads/product_10_1_300x300_76e829e2ec.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:38:45.780Z",
                "updated_at": "2020-12-24T11:38:45.839Z"
            }
        ],
        "category": [
            {
                "id": 11,
                "name": "Decoration",
                "slug": "decoration",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:28:06.841Z",
                "updated_at": "2020-12-24T01:59:58.491Z"
            },
            {
                "id": 7,
                "name": "Furniture",
                "slug": "furniture",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:26:54.185Z",
                "updated_at": "2020-12-24T01:58:35.595Z"
            },
            {
                "id": 13,
                "name": "Armchairs & Chaises",
                "slug": "armchairs-and-chaises",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-18T06:54:20.047Z",
                "updated_at": "2020-12-24T02:00:45.265Z"
            }
        ]
    },
    {
        "id": 117,
        "name": "Carronade Large Suspension Lamp",
        "slug": "carronade-large-suspension-lamp",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 341,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:42:43.333Z",
        "updated_at": "2021-01-22T04:15:12.138Z",
        "pictures": [
            {
                "id": 730,
                "name": "product-5-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-1.jpg",
                        "hash": "thumbnail_product_5_1_610833d99f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.5,
                        "path": null,
                        "url": "/uploads/thumbnail_product_5_1_610833d99f.jpg"
                    },
                    "medium": {
                        "name": "medium_product-5-1.jpg",
                        "hash": "medium_product_5_1_610833d99f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 13.14,
                        "path": null,
                        "url": "/uploads/medium_product_5_1_610833d99f.jpg"
                    },
                    "small": {
                        "name": "small_product-5-1.jpg",
                        "hash": "small_product_5_1_610833d99f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 7.12,
                        "path": null,
                        "url": "/uploads/small_product_5_1_610833d99f.jpg"
                    }
                },
                "hash": "product_5_1_610833d99f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 11.67,
                "url": "/uploads/product_5_1_610833d99f.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:41:05.113Z",
                "updated_at": "2020-12-24T11:41:05.175Z"
            },
            {
                "id": 731,
                "name": "product-5-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-2.jpg",
                        "hash": "thumbnail_product_5_2_a20c18dcf1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.01,
                        "path": null,
                        "url": "/uploads/thumbnail_product_5_2_a20c18dcf1.jpg"
                    },
                    "medium": {
                        "name": "medium_product-5-2.jpg",
                        "hash": "medium_product_5_2_a20c18dcf1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 16.26,
                        "path": null,
                        "url": "/uploads/medium_product_5_2_a20c18dcf1.jpg"
                    },
                    "small": {
                        "name": "small_product-5-2.jpg",
                        "hash": "small_product_5_2_a20c18dcf1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 9.22,
                        "path": null,
                        "url": "/uploads/small_product_5_2_a20c18dcf1.jpg"
                    }
                },
                "hash": "product_5_2_a20c18dcf1",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 13.79,
                "url": "/uploads/product_5_2_a20c18dcf1.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:41:05.138Z",
                "updated_at": "2020-12-24T11:41:05.206Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 733,
                "name": "product-5-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-1-300x300.jpg",
                        "hash": "thumbnail_product_5_1_300x300_1dc848bfc9",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.51,
                        "path": null,
                        "url": "/uploads/thumbnail_product_5_1_300x300_1dc848bfc9.jpg"
                    }
                },
                "hash": "product_5_1_300x300_1dc848bfc9",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 3.1,
                "url": "/uploads/product_5_1_300x300_1dc848bfc9.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:41:22.505Z",
                "updated_at": "2020-12-24T11:41:22.584Z"
            },
            {
                "id": 732,
                "name": "product-5-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-5-2-300x300.jpg",
                        "hash": "thumbnail_product_5_2_300x300_5fe4a7e523",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.05,
                        "path": null,
                        "url": "/uploads/thumbnail_product_5_2_300x300_5fe4a7e523.jpg"
                    }
                },
                "hash": "product_5_2_300x300_5fe4a7e523",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 3.79,
                "url": "/uploads/product_5_2_300x300_5fe4a7e523.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:41:22.481Z",
                "updated_at": "2020-12-24T11:41:22.543Z"
            }
        ],
        "category": [
            {
                "id": 10,
                "name": "Lighting",
                "slug": "lighting",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:27:46.112Z",
                "updated_at": "2020-12-24T01:59:42.794Z"
            }
        ]
    },
    {
        "id": 118,
        "name": "Petite Table Lamp",
        "slug": "petite-table-lamp",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 65,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:52:14.090Z",
        "updated_at": "2021-01-11T03:45:35.031Z",
        "pictures": [
            {
                "id": 734,
                "name": "product-12-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-1.jpg",
                        "hash": "thumbnail_product_12_1_05aac13eb4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.45,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_1_05aac13eb4.jpg"
                    },
                    "medium": {
                        "name": "medium_product-12-1.jpg",
                        "hash": "medium_product_12_1_05aac13eb4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 15.34,
                        "path": null,
                        "url": "/uploads/medium_product_12_1_05aac13eb4.jpg"
                    },
                    "small": {
                        "name": "small_product-12-1.jpg",
                        "hash": "small_product_12_1_05aac13eb4",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 7.96,
                        "path": null,
                        "url": "/uploads/small_product_12_1_05aac13eb4.jpg"
                    }
                },
                "hash": "product_12_1_05aac13eb4",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 14.12,
                "url": "/uploads/product_12_1_05aac13eb4.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:43:31.390Z",
                "updated_at": "2020-12-24T11:43:31.465Z"
            },
            {
                "id": 735,
                "name": "product-12-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-3.jpg",
                        "hash": "thumbnail_product_12_3_472a220c25",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.09,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_3_472a220c25.jpg"
                    },
                    "medium": {
                        "name": "medium_product-12-3.jpg",
                        "hash": "medium_product_12_3_472a220c25",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 13.24,
                        "path": null,
                        "url": "/uploads/medium_product_12_3_472a220c25.jpg"
                    },
                    "small": {
                        "name": "small_product-12-3.jpg",
                        "hash": "small_product_12_3_472a220c25",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 6.55,
                        "path": null,
                        "url": "/uploads/small_product_12_3_472a220c25.jpg"
                    }
                },
                "hash": "product_12_3_472a220c25",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 12.49,
                "url": "/uploads/product_12_3_472a220c25.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:43:31.416Z",
                "updated_at": "2020-12-24T11:43:31.492Z"
            },
            {
                "id": 736,
                "name": "product-12-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-2.jpg",
                        "hash": "thumbnail_product_12_2_0423ed595d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.07,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_2_0423ed595d.jpg"
                    },
                    "medium": {
                        "name": "medium_product-12-2.jpg",
                        "hash": "medium_product_12_2_0423ed595d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 24.11,
                        "path": null,
                        "url": "/uploads/medium_product_12_2_0423ed595d.jpg"
                    },
                    "small": {
                        "name": "small_product-12-2.jpg",
                        "hash": "small_product_12_2_0423ed595d",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 12.05,
                        "path": null,
                        "url": "/uploads/small_product_12_2_0423ed595d.jpg"
                    }
                },
                "hash": "product_12_2_0423ed595d",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 21.82,
                "url": "/uploads/product_12_2_0423ed595d.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:43:31.433Z",
                "updated_at": "2020-12-24T11:43:31.518Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 737,
                "name": "product-12-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-1-300x300.jpg",
                        "hash": "thumbnail_product_12_1_300x300_b966955471",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.44,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_1_300x300_b966955471.jpg"
                    }
                },
                "hash": "product_12_1_300x300_b966955471",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 2.93,
                "url": "/uploads/product_12_1_300x300_b966955471.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:43:54.351Z",
                "updated_at": "2020-12-24T11:43:54.394Z"
            },
            {
                "id": 738,
                "name": "product-12-3-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-3-300x300.jpg",
                        "hash": "thumbnail_product_12_3_300x300_5762cc36c5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.1,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_3_300x300_5762cc36c5.jpg"
                    }
                },
                "hash": "product_12_3_300x300_5762cc36c5",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 2.4,
                "url": "/uploads/product_12_3_300x300_5762cc36c5.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:43:54.417Z",
                "updated_at": "2020-12-24T11:43:54.485Z"
            },
            {
                "id": 739,
                "name": "product-12-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-12-2-300x300.jpg",
                        "hash": "thumbnail_product_12_2_300x300_dd9ba0a9be",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.05,
                        "path": null,
                        "url": "/uploads/thumbnail_product_12_2_300x300_dd9ba0a9be.jpg"
                    }
                },
                "hash": "product_12_2_300x300_dd9ba0a9be",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.94,
                "url": "/uploads/product_12_2_300x300_dd9ba0a9be.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:43:54.452Z",
                "updated_at": "2020-12-24T11:43:54.513Z"
            }
        ],
        "category": [
            {
                "id": 10,
                "name": "Lighting",
                "slug": "lighting",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:27:46.112Z",
                "updated_at": "2020-12-24T01:59:42.794Z"
            }
        ]
    },
    {
        "id": 119,
        "name": "Madra Log Holder",
        "slug": "madra-log-holder",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 40,
        "stock": 100,
        "new": true,
        "created_at": "2020-12-24T11:54:49.775Z",
        "updated_at": "2021-01-08T13:30:13.923Z",
        "pictures": [
            {
                "id": 740,
                "name": "product-13-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-13-1.jpg",
                        "hash": "thumbnail_product_13_1_98bda9dd98",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3,
                        "path": null,
                        "url": "/uploads/thumbnail_product_13_1_98bda9dd98.jpg"
                    },
                    "medium": {
                        "name": "medium_product-13-1.jpg",
                        "hash": "medium_product_13_1_98bda9dd98",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 29.16,
                        "path": null,
                        "url": "/uploads/medium_product_13_1_98bda9dd98.jpg"
                    },
                    "small": {
                        "name": "small_product-13-1.jpg",
                        "hash": "small_product_13_1_98bda9dd98",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 16.01,
                        "path": null,
                        "url": "/uploads/small_product_13_1_98bda9dd98.jpg"
                    }
                },
                "hash": "product_13_1_98bda9dd98",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 25.31,
                "url": "/uploads/product_13_1_98bda9dd98.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:52:51.046Z",
                "updated_at": "2020-12-24T11:52:51.109Z"
            },
            {
                "id": 741,
                "name": "product-13-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-13-2.jpg",
                        "hash": "thumbnail_product_13_2_7868c52991",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.45,
                        "path": null,
                        "url": "/uploads/thumbnail_product_13_2_7868c52991.jpg"
                    },
                    "medium": {
                        "name": "medium_product-13-2.jpg",
                        "hash": "medium_product_13_2_7868c52991",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 22.35,
                        "path": null,
                        "url": "/uploads/medium_product_13_2_7868c52991.jpg"
                    },
                    "small": {
                        "name": "small_product-13-2.jpg",
                        "hash": "small_product_13_2_7868c52991",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 12.43,
                        "path": null,
                        "url": "/uploads/small_product_13_2_7868c52991.jpg"
                    }
                },
                "hash": "product_13_2_7868c52991",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 19.33,
                "url": "/uploads/product_13_2_7868c52991.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:52:51.070Z",
                "updated_at": "2020-12-24T11:52:51.147Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 743,
                "name": "product-13-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-13-1-300x300.jpg",
                        "hash": "thumbnail_product_13_1_300x300_338f481ae5",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 3.03,
                        "path": null,
                        "url": "/uploads/thumbnail_product_13_1_300x300_338f481ae5.jpg"
                    }
                },
                "hash": "product_13_1_300x300_338f481ae5",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 6.74,
                "url": "/uploads/product_13_1_300x300_338f481ae5.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:53:01.144Z",
                "updated_at": "2020-12-24T11:53:01.214Z"
            },
            {
                "id": 742,
                "name": "product-13-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-13-2-300x300.jpg",
                        "hash": "thumbnail_product_13_2_300x300_c669393809",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.47,
                        "path": null,
                        "url": "/uploads/thumbnail_product_13_2_300x300_c669393809.jpg"
                    }
                },
                "hash": "product_13_2_300x300_c669393809",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 5.09,
                "url": "/uploads/product_13_2_300x300_c669393809.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:53:01.120Z",
                "updated_at": "2020-12-24T11:53:01.180Z"
            }
        ],
        "category": [
            {
                "id": 14,
                "name": "Decor",
                "slug": "decor",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-28T10:59:05.002Z",
                "updated_at": "2020-12-24T03:45:24.950Z"
            },
            {
                "id": 16,
                "name": "Storage Boxes & Baskets",
                "slug": "storage-boxes-and-baskets",
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T03:46:32.079Z",
                "updated_at": "2020-12-24T03:46:32.152Z"
            },
            {
                "id": 15,
                "name": "Kitchen Cabinets",
                "slug": "kitchen-cabinets",
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T03:45:47.540Z",
                "updated_at": "2020-12-24T03:45:47.615Z"
            }
        ]
    },
    {
        "id": 120,
        "name": "Original Outdoor Beanbag",
        "slug": "original-outdoor-beanbag",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 80,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T11:56:57.899Z",
        "updated_at": "2021-01-14T23:23:23.647Z",
        "pictures": [
            {
                "id": 744,
                "name": "product-14-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-1.jpg",
                        "hash": "thumbnail_product_14_1_dbab4358ec",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.35,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_1_dbab4358ec.jpg"
                    },
                    "medium": {
                        "name": "medium_product-14-1.jpg",
                        "hash": "medium_product_14_1_dbab4358ec",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 23.61,
                        "path": null,
                        "url": "/uploads/medium_product_14_1_dbab4358ec.jpg"
                    },
                    "small": {
                        "name": "small_product-14-1.jpg",
                        "hash": "small_product_14_1_dbab4358ec",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 12.78,
                        "path": null,
                        "url": "/uploads/small_product_14_1_dbab4358ec.jpg"
                    }
                },
                "hash": "product_14_1_dbab4358ec",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 21.04,
                "url": "/uploads/product_14_1_dbab4358ec.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:34.260Z",
                "updated_at": "2020-12-24T11:55:34.363Z"
            },
            {
                "id": 745,
                "name": "product-14-2.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-2.jpg",
                        "hash": "thumbnail_product_14_2_17ae88fea1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.92,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_2_17ae88fea1.jpg"
                    },
                    "medium": {
                        "name": "medium_product-14-2.jpg",
                        "hash": "medium_product_14_2_17ae88fea1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 29.97,
                        "path": null,
                        "url": "/uploads/medium_product_14_2_17ae88fea1.jpg"
                    },
                    "small": {
                        "name": "small_product-14-2.jpg",
                        "hash": "small_product_14_2_17ae88fea1",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 16.39,
                        "path": null,
                        "url": "/uploads/small_product_14_2_17ae88fea1.jpg"
                    }
                },
                "hash": "product_14_2_17ae88fea1",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 25.76,
                "url": "/uploads/product_14_2_17ae88fea1.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:34.284Z",
                "updated_at": "2020-12-24T11:55:34.393Z"
            },
            {
                "id": 747,
                "name": "product-14-3.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-3.jpg",
                        "hash": "thumbnail_product_14_3_8aedda7791",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.86,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_3_8aedda7791.jpg"
                    },
                    "medium": {
                        "name": "medium_product-14-3.jpg",
                        "hash": "medium_product_14_3_8aedda7791",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 20.12,
                        "path": null,
                        "url": "/uploads/medium_product_14_3_8aedda7791.jpg"
                    },
                    "small": {
                        "name": "small_product-14-3.jpg",
                        "hash": "small_product_14_3_8aedda7791",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 10.86,
                        "path": null,
                        "url": "/uploads/small_product_14_3_8aedda7791.jpg"
                    }
                },
                "hash": "product_14_3_8aedda7791",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 18.2,
                "url": "/uploads/product_14_3_8aedda7791.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:34.324Z",
                "updated_at": "2020-12-24T11:55:34.461Z"
            },
            {
                "id": 746,
                "name": "product-14-4.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-4.jpg",
                        "hash": "thumbnail_product_14_4_a416d6e8cd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.78,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_4_a416d6e8cd.jpg"
                    },
                    "medium": {
                        "name": "medium_product-14-4.jpg",
                        "hash": "medium_product_14_4_a416d6e8cd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 19.56,
                        "path": null,
                        "url": "/uploads/medium_product_14_4_a416d6e8cd.jpg"
                    },
                    "small": {
                        "name": "small_product-14-4.jpg",
                        "hash": "small_product_14_4_a416d6e8cd",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 10.15,
                        "path": null,
                        "url": "/uploads/small_product_14_4_a416d6e8cd.jpg"
                    }
                },
                "hash": "product_14_4_a416d6e8cd",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 18.07,
                "url": "/uploads/product_14_4_a416d6e8cd.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:34.304Z",
                "updated_at": "2020-12-24T11:55:34.427Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 748,
                "name": "product-14-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-1-300x300.jpg",
                        "hash": "thumbnail_product_14_1_300x300_627d43a050",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.38,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_1_300x300_627d43a050.jpg"
                    }
                },
                "hash": "product_14_1_300x300_627d43a050",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 5.19,
                "url": "/uploads/product_14_1_300x300_627d43a050.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:51.508Z",
                "updated_at": "2020-12-24T11:55:51.611Z"
            },
            {
                "id": 749,
                "name": "product-14-2-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-2-300x300.jpg",
                        "hash": "thumbnail_product_14_2_300x300_2154bc1dd6",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.95,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_2_300x300_2154bc1dd6.jpg"
                    }
                },
                "hash": "product_14_2_300x300_2154bc1dd6",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 6.87,
                "url": "/uploads/product_14_2_300x300_2154bc1dd6.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:51.530Z",
                "updated_at": "2020-12-24T11:55:51.646Z"
            },
            {
                "id": 750,
                "name": "product-14-3-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-3-300x300.jpg",
                        "hash": "thumbnail_product_14_3_300x300_011cc9330f",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.91,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_3_300x300_011cc9330f.jpg"
                    }
                },
                "hash": "product_14_3_300x300_011cc9330f",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 4.45,
                "url": "/uploads/product_14_3_300x300_011cc9330f.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:51.550Z",
                "updated_at": "2020-12-24T11:55:51.675Z"
            },
            {
                "id": 751,
                "name": "product-14-4-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-14-4-300x300.jpg",
                        "hash": "thumbnail_product_14_4_300x300_84aa7cc3d2",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 1.79,
                        "path": null,
                        "url": "/uploads/thumbnail_product_14_4_300x300_84aa7cc3d2.jpg"
                    }
                },
                "hash": "product_14_4_300x300_84aa7cc3d2",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 3.85,
                "url": "/uploads/product_14_4_300x300_84aa7cc3d2.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:55:51.571Z",
                "updated_at": "2020-12-24T11:55:51.708Z"
            }
        ],
        "category": [
            {
                "id": 16,
                "name": "Storage Boxes & Baskets",
                "slug": "storage-boxes-and-baskets",
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T03:46:32.079Z",
                "updated_at": "2020-12-24T03:46:32.152Z"
            },
            {
                "id": 14,
                "name": "Decor",
                "slug": "decor",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-28T10:59:05.002Z",
                "updated_at": "2020-12-24T03:45:24.950Z"
            },
            {
                "id": 11,
                "name": "Decoration",
                "slug": "decoration",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-14T10:28:06.841Z",
                "updated_at": "2020-12-24T01:59:58.491Z"
            },
            {
                "id": 12,
                "name": "Beds",
                "slug": "beds",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-18T06:46:56.197Z",
                "updated_at": "2020-12-24T02:00:13.871Z"
            }
        ]
    },
    {
        "id": 121,
        "name": "Windback Chair",
        "slug": "windback-chair",
        "short_desc": "Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, ",
        "price": 199,
        "stock": 100,
        "new": null,
        "created_at": "2020-12-24T12:01:00.177Z",
        "updated_at": "2020-12-29T23:27:45.680Z",
        "pictures": [
            {
                "id": 752,
                "name": "product-15-1.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 800,
                "height": 800,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-15-1.jpg",
                        "hash": "thumbnail_product_15_1_3159f60735",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.16,
                        "path": null,
                        "url": "/uploads/thumbnail_product_15_1_3159f60735.jpg"
                    },
                    "medium": {
                        "name": "medium_product-15-1.jpg",
                        "hash": "medium_product_15_1_3159f60735",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 750,
                        "height": 750,
                        "size": 40.01,
                        "path": null,
                        "url": "/uploads/medium_product_15_1_3159f60735.jpg"
                    },
                    "small": {
                        "name": "small_product-15-1.jpg",
                        "hash": "small_product_15_1_3159f60735",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 500,
                        "height": 500,
                        "size": 17.97,
                        "path": null,
                        "url": "/uploads/small_product_15_1_3159f60735.jpg"
                    }
                },
                "hash": "product_15_1_3159f60735",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 36.75,
                "url": "/uploads/product_15_1_3159f60735.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:59:44.608Z",
                "updated_at": "2020-12-24T11:59:44.636Z"
            }
        ],
        "sm_pictures": [
            {
                "id": 753,
                "name": "product-15-1-300x300.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 300,
                "height": 300,
                "formats": {
                    "thumbnail": {
                        "name": "thumbnail_product-15-1-300x300.jpg",
                        "hash": "thumbnail_product_15_1_300x300_d63bee55db",
                        "ext": ".jpg",
                        "mime": "image/jpeg",
                        "width": 156,
                        "height": 156,
                        "size": 2.17,
                        "path": null,
                        "url": "/uploads/thumbnail_product_15_1_300x300_d63bee55db.jpg"
                    }
                },
                "hash": "product_15_1_300x300_d63bee55db",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 5.88,
                "url": "/uploads/product_15_1_300x300_d63bee55db.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T11:59:53.419Z",
                "updated_at": "2020-12-24T11:59:53.450Z"
            }
        ],
        "category": [
            {
                "id": 17,
                "name": "Sofas & Sleeper Sofas",
                "slug": "sofas-and-sleeper-sofas",
                "created_by": 4,
                "updated_by": 4,
                "created_at": "2020-12-24T03:46:57.236Z",
                "updated_at": "2020-12-24T03:46:57.307Z"
            },
            {
                "id": 14,
                "name": "Decor",
                "slug": "decor",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-28T10:59:05.002Z",
                "updated_at": "2020-12-24T03:45:24.950Z"
            },
            {
                "id": 13,
                "name": "Armchairs & Chaises",
                "slug": "armchairs-and-chaises",
                "created_by": null,
                "updated_by": 4,
                "created_at": "2020-03-18T06:54:20.047Z",
                "updated_at": "2020-12-24T02:00:45.265Z"
            }
        ]
    }
  ];
  
  await dbConnect.collection('products')
    .insert(products, function (err) {
      if (err) {
        res.status(400).send('Error inserting matches!');
        return;
      } else {
        console.log(`Added a ${products.length} items to Mongo DB products collection`);
        res.status(204).send();
        return;
      }
    })
});

module.exports = recordRoutes;
