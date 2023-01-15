import { Helmet } from "react-helmet";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Container, Navbar } from "react-bootstrap";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import BestSellers from '../components/BestSellers';
import Products from '../components/Products';
import Loading from '../components/Loader';
import CreateNewItemModal from "../components/Modal/CreateNewItemModal";

import styles from '../../styles/Home.module.scss';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  console.log("showFavorites:", showFavorites);

  useEffect(() => {
    setLoading(true);
    setShowFavorites(JSON.parse(window.localStorage.getItem("showFavorites")));
    axios.get("/api/products")
      .then(({ data }) => {
        const allProducts = data.products;

        if (products.length !== allProducts.length) {
          setProducts(allProducts);
          setBestSellers(allProducts.filter(p => p.sales > 200));
          setFavorites(allProducts.filter(p => p.favorite === true));
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [products.length, showFavorites]);

  const addToFavorite = ({ id }) => {
    const data = products.shoes.find(item => item.id === id);
    setProducts({
      productsFav: [...products.productsFav, data]
    });
  };

  return (
    <>
      <Helmet>
        <title>XCO+ Store</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Navbar className={styles.navbar_products}>
        <Container className={styles.container_products}>
          <h2>Produtos</h2>
          <div className={styles.input_container}>
            <MagnifyingGlassIcon className={styles.search_icon} />
            <input type="search" placeholder="Buscar por produtos" />
          </div>
        </Container>
      </Navbar>
      <Navbar className={styles.navbar_buttons}>
        <Container className={styles.container_buttons}>
          <div className={styles.left_buttons}>
            <Button className={styles.home_button} onClick={() => setShowFavorites(false)}>Todas</Button>
            <Button className={styles.favorite_button} onClick={() => setShowFavorites(true)}>Favoritos</Button>
          </div>

          <button onClick={handleShowModal}>Criar novo</button>
          <CreateNewItemModal handleCloseModal={handleCloseModal} show={showModal} />
        </Container>
      </Navbar>

      {
        loading ? <Loading />
          :
          <main className={styles.main}>
            <BestSellers products={bestSellers} />
            <Products products={showFavorites ? favorites : products} addToFavorite={addToFavorite} />
          </main>
      }
    </>
  )
}
