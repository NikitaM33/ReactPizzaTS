import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./scss/app.scss";
import { Home, Cart, NotFound } from "./pages";
import { Header } from "./components";

{/* Контекст */}
export const SearchContext = React.createContext();

function App() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="wrapper">
      {/* Передаем инфу с помощью контекста */}
      <SearchContext.Provider value={{ searchValue, setSearchValue }}>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </SearchContext.Provider>
    </div>
  );
}

export default App;
