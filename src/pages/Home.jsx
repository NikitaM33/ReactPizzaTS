import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SearchContext } from "../App";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";

import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";
import {
  Categories,
  Sort,
  PizzaBlock,
  Skeleton,
  Pagination,
} from "../components";
import { sortList } from "../components/Sort/Sort";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId, sort, currentPage } = useSelector(({ filter }) => filter);
  const sortType = sort.sortProperty;
  const isSearchRef = useRef(false);

  const { searchValue } = useContext(SearchContext);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [sortType, setSortType] = useState({
  //   name: "популярности",
  //   sortProperty: "rating",
  // });

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const skeleton = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));

  const pizzas = items
    // ===== Поиск по строке, который хорошо подходит для статичных данных ====
    // .filter((obj) => {
    //   if (obj.name.toLowerCase().includes(searchValue.toLowerCase())) {
    //     return true;
    //   }

    //   return false;
    // })
    .map((pizza) => (
      <PizzaBlock
        key={pizza.id}
        imageUrl={pizza.imageUrl}
        title={pizza.name}
        price={pizza.price}
        sizes={pizza.size}
        types={pizza.types}
      />
    ));

  const fetchPizzas = () => {
    setIsLoading(true);

    const sortBy = sortType.replace("-", "");
    const order = sortType.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    // fetch(
    //   `https://629e54413dda090f3c17faa2.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    // )
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setItems(json);
    //     setIsLoading(false);
    //   });

    axios
      .get(
        `https://629e54413dda090f3c17faa2.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      )
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find(
        (obj) => obj.sortProperty === params.sortProperty
      );

      console.log("Home", params);

      dispatch(
        setFilters({
          ...params,
          sort,
        })
      );

      isSearchRef.current = true;
    }
  }, []);

  useEffect(() => {
    const queryString = qs.stringify({
      sortProperty: sort.sortProperty,
      categoryId,
      currentPage,
    });

    navigate(`?${queryString}`);
  }, [categoryId, sortType, currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearchRef.current) {
      fetchPizzas();
    }

    isSearchRef.current = false;
  }, [categoryId, sortType, searchValue, currentPage]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeleton : pizzas}</div>

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
