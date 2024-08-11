import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import IconTrash from '../assets/icons/IconTrash';
import IconEdit from '../assets/icons/IconEdit';
import { formatDataTime } from "../utils/Format";

const Laptop = () => {
  const [laptops, _setLaptops] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  useEffect(() => {
    getLaptops();
  }, []);

  const getLaptops = (() => {
    setLoading(true);
    axiosClient.get('/laptops')
      .then(({ data }) => {
        setLoading(false);
        _setLaptops(data.laptops.data)
      })
      .catch(() => {
        setLoading(false);
      })
  });

  const onDelete = ((laptop) => {
    if (!window.confirm("Are you sure you want to delete this laptop?")) {
      return
    }
    axiosClient.delete(`/laptops/${laptop.id}`)
      .then(() => {
          setNotification("Laptop was successfully deleted")
          getLaptops();
      })
})
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'

      }}>
        <h1>Laptop</h1>
        <Link to="/laptops/new" className="btn-add">Add New</Link>
      </div>
      <div className="card animated fadeInDown">
        <div className="card animated fadeInDown">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Processor</th>
                <th>Graphics</th>
                <th>Ram</th>
                <th>Storage</th>
                <th>Screen</th>
                <th>Price</th>
                <th>Create Date</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading && <tbody>
              <tr>
                <td colSpan="10" className="text-center">Loading...</td>
              </tr>
            </tbody>
            }
            {!loading &&
              <tbody>
                {laptops.length > 0 && laptops.map(laptop => (
                  <tr key={laptop.id}>
                    <td>{laptop.id}</td>
                    <td>{laptop.name}</td>
                    <td>{laptop.CPU}</td>
                    <td>{laptop.GPU}</td>
                    <td>{laptop.ram}</td>
                    <td>{laptop.storage}</td>
                    <td>{laptop.screen}</td>
                    <td style={{ color: 'red' }}>{laptop.price} $</td>
                    <td>{formatDataTime(laptop.created_at)}</td>
                    <td>
                      <div 
                          style={{
                              listStyleType: 'none'
                          }}
                      >
                          {laptop.images.length > 0 && (
                              <div key={laptop.images[0].id}>
                                  <img
                                      src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${laptop.images[0].image_path}`}
                                      alt={`Laptop ${laptop.id} Image`}
                                      style={{ width: '80px', height: 'auto'}}
                                  />
                              </div>
                          )}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        <Link
                          className="btn-edit"
                          to={'/laptops/' + laptop.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          Edit&nbsp;
                          <IconEdit
                            iconSize="17px"
                            iconColor="#ffffff"
                          />
                        </Link>
                        &nbsp;&nbsp;
                        <button
                          onClick={ev => onDelete(laptop)}
                          className="btn-delete"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          Delete&nbsp;
                          <IconTrash
                            iconSize="17px"
                            iconColor="#ffffff"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            }
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laptop;
