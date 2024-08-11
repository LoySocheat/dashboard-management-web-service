import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { formatDataTime } from "../utils/Format";
import { useStateContext } from "../contexts/ContextProvider";
import IconTrash from "../assets/icons/IconTrash";
import IconEdit from "../assets/icons/IconEdit";
import ProductDetail from "./ProductDetail";
import ConfirmDeleteModal from "./ConfimDeleteModel";

const Product = () => {
  const [products, _setProducts] = useState([]);
  const [product, _setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProductDetailOpen, setisProductDetailOpen] = useState(false);
  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setLoadingPage(false);
    getProducts();
  }, [currentPage, loadingPage]);

  const getProducts = () => {
    setLoading(true);
    axiosClient
      .get(`/products?page=${currentPage}`)
      .then((res) => {
        setLoading(false);
        _setProducts(res.data.products.data);
        setTotalPages(res.data.products.last_page);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching order data:", error);
      });
  };

  const handleGoToPage = () => {
    const parsedPage = parseInt(goToPage, 10);
    if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
      setCurrentPage(parsedPage);
      setGoToPage("");
    } else {
      // Handle invalid input (e.g., show an error message)
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (product, event) => {
    event.stopPropagation();
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = (ev) => {
    console.log(product);
    axiosClient
      .delete(`/products/${selectedProduct.id}`)
      .then((res) => {
        if (!res.data.success) {
          return setNotification(res.data.message);
        }
        setIsDeleteModalOpen(false);
        setLoadingPage(true);
        return setNotification(res.data.message);
      })
  };

  const handleRowClick = (productId, event) => {
    axiosClient.get(`/products/${productId}`).then((res) => {
      if (!res.data.success) {
        console.log(res.success);
        return setNotification(res.data.message);
      }
      _setProduct(res.data.product);
      setisProductDetailOpen(true);
      return;
    });
  };

  const handleCloseProductDetail = () => {
    setisProductDetailOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Product Management</h1>
        <Link to="/products/new" className="btn-add">
          Add New
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <div className="card animated fadeInDown">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Processor</th>
                <th>Ram</th>
                <th>Storage</th>
                <th>Create Date</th>
                <th>/</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading && (
              <tbody>
                <tr>
                  <td colSpan="10" className="text-center">
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
            {!loading && (
              <tbody>
                {products.length > 0 &&
                  products.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => handleRowClick(product.id)}
                      className="hover-element"
                    >
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td style={{ color: "red" }}>{product.price} $</td>
                      <td>{product.processor}</td>
                      <td>{product.ram}</td>
                      <td>{product.storage}</td>
                      <td>{formatDataTime(product.created_at)}</td>
                      <td>
                        <ul
                          style={{
                            listStyleType: "none",
                          }}
                        >
                          {/* {product.images.length > 0 && (
                            <li key={product.images[0].id}>
                              <img
                                src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${product.images[0].image_path}`}
                                alt={`Product ${product.id} Image`}
                                style={{
                                  width: "100px",
                                  height: "auto",
                                  margin: "5px",
                                }}
                              />
                            </li>
                          )} */}
                        </ul>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <Link
                            className="btn-edit"
                            to={"/products/" + product.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Edit&nbsp;
                            <IconEdit iconSize="20px" iconColor="#ffffff" />
                          </Link>
                          &nbsp;&nbsp;
                          <button
                            onClick={(ev) => handleDeleteClick(product, ev)}
                            className="btn-delete"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Delete&nbsp;
                            <IconTrash iconSize="20px" iconColor="#ffffff" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {products.length <= 0 && (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No Product
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <div className="pagination">
        <div className="current-search">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <input
            type="text"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            placeholder={`1-${totalPages}`}
          />
          <button onClick={handleGoToPage}>Go</button>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={setIsDeleteModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          userName=""
        />
      )}
      {isProductDetailOpen && (
        <ProductDetail product={product} onClose={handleCloseProductDetail} />
      )}
    </div>
  );
};

export default Product;
