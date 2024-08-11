import React, { useEffect, useState } from 'react';
import axiosClient from '../axios-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import IconTrash from '../assets/icons/IconTrash';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    const [product, _setProduct] = useState({
        id: null,
        name: '',
        brand: '',
        processor: '',
        ram: '',
        storage: '',
        price: '',
        images: [],
    });
    const [productData, setProductData] = useState({
        images: [],
    });

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient.get(`/products/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    _setProduct(data.product)
                })
                .catch(() => {
                    setLoading(false);
                })
        }, [])
    }

    const handleImageChange = (e, index) => {
        const images = [...productData.images];
        images[index] = e.target.files[0];
        setProductData((prevData) => ({
            ...prevData,
            images,
        }));
    };

    const addImageInput = () => {
        setProductData((prevData) => ({
            ...prevData,
            images: [...prevData.images, null],
        }));
    };

    const deleteImage = (image)=> {
        if(image.id){
            axiosClient.delete(`/products/${image.product_id}/images/${image.id}`)
                .then(() => {
                    window.location.reload();
                    setNotification("Product was successfully deleted")
                    getProducts();
                })
        } else {
            const updatedImages = [...productData.images];
                // console.log(image)
            updatedImages.splice(image, 1);
            setProductData((prevData) => ({
                ...prevData,
                images: updatedImages,
            }));
        }
    }

    const handleSubmit = async (e) => {
        if(product.id){
            e.preventDefault();
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('brand', product.brand);
            formData.append('processor', product.processor);
            formData.append('ram', product.ram);
            formData.append('storage', product.storage);
    
            productData.images.forEach((image, index) => {
                formData.append(`new_image_path[${index}]`, image);
            });

            axiosClient.post(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    setNotification("Product was successfully updated")
                    navigate('/products')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            e.preventDefault();
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('brand', product.brand);
            formData.append('processor', product.processor);
            formData.append('ram', product.ram);
            formData.append('storage', product.storage);
      
            productData.images.forEach((image, index) => {
              formData.append(`images[${index}]`, image);
            });
      
            axiosClient.post('/products', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
                .then(() => {
                    setNotification("Product was successfully created")
                    navigate('/products')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    };

    return (
        <>
            {product.id && <h1>Update Product: {product.name} - {product.brand}</h1>}
            {!product.id && <h1>New Product</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">Loading...</div>
                )}
                {errors && <div className="alert">
                    {Object.keys(errors).map(key => {
                        <p key={key}>{errors[key][0]}</p>
                    })}
                </div>
                }
                {!loading &&
                    <form onSubmit={handleSubmit}>
                        <input value={product.name} onChange={ev => _setProduct({ ...product, name: ev.target.value })} type="text" placeholder='Name' />
                        <input value={product.brand} onChange={ev => _setProduct({ ...product, brand: ev.target.value })} type="text" placeholder='Brand' />
                        <input value={product.processor} onChange={ev => _setProduct({ ...product, processor: ev.target.value })} type="text" placeholder='Processor' />
                        <input value={product.ram} onChange={ev => _setProduct({ ...product, ram: ev.target.value })} type="text" placeholder='Ram' />
                        <input value={product.storage} onChange={ev => _setProduct({ ...product, storage: ev.target.value })} type="text" placeholder='Storage' />
                        <input value={product.price} onChange={ev => _setProduct({ ...product, price: ev.target.value })} type="text" placeholder='Price' />
                        <label>
                            {productData.images.map((image, index) => (
                                <div key={index}>
                                    <input type="file" name={`images[${index}]`} onChange={(e) => handleImageChange(e, index)} accept='image/png, image/jpeg, image/jpg'/>
                                </div>
                            ))}
                            <button type="button" onClick={addImageInput} className='btn'>Add Image</button>&nbsp;&nbsp;
                        </label>
                        { id &&<button type="submit" className='btn'>Update Product</button>}
                        { !id &&<button type="submit" className='btn'>Create Product</button>}
                        {/* Display uploaded images */}
                        <h3>New Images:</h3>
                        <div className='show-images'>
                            { productData.images.length > 0 && <div className="main-container">
                                <ul className="grid-wrapper">
                                    {productData.images.map((image, index) => {
                                        if (image) {
                                            const imageUrl = URL.createObjectURL(image);
                                            return (
                                                <li key={index}>
                                                    <img
                                                        key={index}
                                                        src={imageUrl}
                                                        alt={`Image ${index + 1}`}
                                                        style={{ width: '100%', height: 'auto', margin: '5px' }}
                                                    />
                                                    <div className="popup-icon" onClick= {ev => deleteImage(index)}>
                                                        <IconTrash iconColor="#ffffff"/>
                                                    </div>
                                                </li>
                                            )
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>}
                            { productData.images.length <= 0 &&
                                <p className='text-center'>No Images</p>
                            }
                        </div>
                        { id && <div>
                            <h3>Old Images:</h3>
                            <div className='show-images'>
                                {product.images.length > 0 &&  
                                    <div className='main-container'>
                                    <ul className='grid-wrapper'>
                                        {product.images.map((image, index) => {
                                            if (image) {
                                                return (
                                                    <li key={index}>
                                                        <img
                                                            src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${image.image_path}`}
                                                            alt={`Product ${product.id} Image`}
                                                            style={{ width: '100%', height: '100%', margin: '5px', display: 'block', objectFit: 'cover' }}
                                                        />
                                                        <div className="popup-icon" onClick= {ev => deleteImage(image)}>
                                                            <IconTrash iconColor="#ffffff"/>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                            return null;
                                        })}
                                    </ul>
                                    </div>
                                }
                                {product.images.length <= 0 &&
                                    <p className='text-center'>No Images</p>
                                }
                            </div>
                        </div>
                    }
                    </form>
                }
            </div>
        </>
    );
};

export default ProductForm;

