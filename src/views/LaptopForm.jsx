import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconTrash from '../assets/icons/IconTrash';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

const LaptopForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();
  const [laptop, _setLaptops] = useState({
    id: null,
    name: '',
    brand: '',
    CPU: '',
    GPU: '',
    ram: '',
    storage: '',
    screen: '',
    price: '',
    description: '',
    images: []
  });

  const [laptopData, setLaptopData] = useState({
    images: []
  })

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient.get(`/laptops/${id}`)
        .then(({data}) => {
          setLoading(false);
          _setLaptops(data.laptop)
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error fetching images:', error);
        })
    }, []);
  }

  const handleImageChange = (e, index) => {
    const images = [...laptopData.images];
    images[index] = e.target.files[0];
    setLaptopData((prevData) => ({
        ...prevData,
        images,
    }));
  }

  const addImageInput = () => {
    setLaptopData((prevData) => ({
      ...prevData,
      images: [...prevData.images, null],
    }));
  };

  const handleSubmit = (e) => {
    if(laptop.id){
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', laptop.name);
      formData.append('brand', laptop.brand);
      formData.append('CPU', laptop.CPU);
      formData.append('GPU', laptop.GPU);
      formData.append('ram', laptop.ram);
      formData.append('storage', laptop.storage);
      formData.append('screen', laptop.screen);
      formData.append('price', laptop.price);
      formData.append('description', laptop.description);

      laptopData.images.forEach((image, index) => {
        formData.append(`new_image_path[${index}]`, image);
      });

      axiosClient.post(`/laptops/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(() => {
        setNotification("Laptop was successfully updated")
        navigate('/laptops')
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
      formData.append('name', laptop.name);
      formData.append('brand', laptop.brand);
      formData.append('CPU', laptop.CPU);
      formData.append('GPU', laptop.GPU);
      formData.append('ram', laptop.ram);
      formData.append('storage', laptop.storage);
      formData.append('screen', laptop.screen);
      formData.append('price', laptop.price);
      formData.append('description', laptop.description);

      laptopData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      axiosClient.post('/laptops', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
          .then(() => {
              setNotification("Laptop was successfully created")
              navigate('/laptops')
          })
          .catch(err => {
              const response = err.response;
              if (response && response.status === 422) {
                  setErrors(response.data.errors)
              }
          })
  }
  }


  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();

    const draggedImageId = e.dataTransfer.getData('text/plain');
    const updatedImages = [...laptop.images];
    const draggedImage = updatedImages.find(image => image.id.toString() === draggedImageId);

    if (draggedImage) {
      const draggedIndex = updatedImages.findIndex(image => image.id === draggedImage.id);
      updatedImages.splice(draggedIndex, 1);
      updatedImages.splice(targetIndex, 0, draggedImage);

      _setLaptops(prevState => ({
        ...prevState,
        images: updatedImages,
      }));

      const imageOrder = updatedImages.map(image => image.id);

      axiosClient.post('/update-image', { imageOrder })
        .then(response => {
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('Error updating image order:', error);
        });
    }
  };

  const deleteImage = (image)=> {
    if(image.id){
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return
        }
        axiosClient.delete(`/laptops/${image.laptop_id}/images/${image.id}`)
            .then(() => {
                window.location.reload();
                setNotification("Product was successfully deleted")
                getProducts();
            })
    } else {
        const updatedImages = [...laptopData.images];
        updatedImages.splice(image, 1);
        setLaptopData((prevData) => ({
            ...prevData,
            images: updatedImages,
        }));
    }
}

  return (
    <div>
        {laptop.id && <h1>Update Laptop: {laptop.name} - {laptop.brand}</h1>}
        {!laptop.id && <h1>New Laptop</h1>}
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
              <input value={laptop.name} onChange={ev => _setLaptops({...laptop, name: ev.target.value })} type="text" placeholder='Name' />
              <input value={laptop.brand} onChange={ev => _setLaptops({...laptop, brand: ev.target.value })} type="text" placeholder='Brand' />
              <input value={laptop.CPU} onChange={ev => _setLaptops({...laptop, CPU: ev.target.value })} type="text" placeholder='Processor' />
              <input value={laptop.GPU} onChange={ev => _setLaptops({...laptop, GPU: ev.target.value })} type="text" placeholder='Graphics' />
              <input value={laptop.ram} onChange={ev => _setLaptops({...laptop, ram: ev.target.value })} type="text" placeholder='Ram' />
              <input value={laptop.storage} onChange={ev => _setLaptops({...laptop, storage: ev.target.value })} type="text" placeholder='Storage' />
              <input value={laptop.screen} onChange={ev => _setLaptops({...laptop, screen: ev.target.value })} type="text" placeholder='Screen' />
              <input value={laptop.price} onChange={ev => _setLaptops({...laptop, price: ev.target.value })} type="text" placeholder='Price' />
              <textarea value={laptop.description || ''} onChange={(ev) => _setLaptops({ ...laptop, description: ev.target.value })} cols="30" rows="5" placeholder="Description" ></textarea>
              <label>
                {laptopData.images.map((image, index) => (
                  <div key={index}>
                    <input type="file" name={`images[${index}]`} onChange={(e) => handleImageChange(e, index)} accept='image/png, image/jpeg, image/jpg'/>
                  </div>
                ))}
                <button type="button" onClick={addImageInput} className='btn'>Add Image</button>&nbsp;&nbsp;
              </label>
              { id &&<button type="submit" className='btn'>Update Laptop</button>}
              { !id &&<button type="submit" className='btn'>Create Laptop</button>}
              {/* Display uploaded images */}
              <h3>New Images:</h3>
              <div className='show-images'>
                { laptopData.images.length > 0 && <div className="main-container">
                    <ul className="grid-wrapper">
                        {laptopData.images.map((image, index) => {
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
                { laptopData.images.length <= 0 &&
                    <p className='text-center'>No Images</p>
                }
              </div>
              { id && 
                <div>
                  <h3>Old Images:</h3>
                  <div className='show-images'>
                  {laptop.images.length > 0 &&  
                    <div className='main-container'>
                      <ul className='grid-wrapper'>
                          {laptop.images.map((image, index) => {
                              if (image) {
                                  return (
                                      <li 
                                        key={index}
                                        onDragStart={(e) => handleDragStart(e, image.id)}
                                        draggable
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        style={{
                                          border: '1px solid #ddd',
                                          padding: '8px',
                                          marginBottom: '8px',
                                          backgroundColor: 'white',
                                        }}
                                      >
                                          <img
                                              src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${image.image_path}`}
                                              alt={`Laptop ${laptop.id} Image`}
                                              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
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
                  </div>
                </div>
              }
            </form>
          }
        </div>

    </div>
  );
};

export default LaptopForm;
