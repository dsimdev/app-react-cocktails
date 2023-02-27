import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cocktails, setCocktails] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${url}${searchTerm}`);
      const { drinks } = resp.data;

      if (!drinks) {
        setCocktails([]);
      } else {
        const newCocktails = drinks.map((drink) => {
          const { strDrink, idDrink, strDrinkThumb, strAlcoholic, strGlass } =
            drink;
          return {
            id: idDrink,
            name: strDrink,
            img: strDrinkThumb,
            info: strAlcoholic,
            glass: strGlass,
          };
        });
        setCocktails(newCocktails);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  return (
    <AppContext.Provider
      value={{
        loading,
        searchTerm,
        cocktails,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
