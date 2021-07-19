import { useState, useEffect } from "react";
import axios from "axios";

const DataFetching = () => {
  const URL = "http://127.0.0.1:8000/";
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios.get(URL).then((response) => console.log(response));
    return () => {};
  }, []);
  return <div></div>;
};

export default DataFetching;
