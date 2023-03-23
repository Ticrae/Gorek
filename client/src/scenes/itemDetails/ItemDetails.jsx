import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, Tabs, Tab, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../../theme";
import { addToCart } from "../../state/index";
import { useParams } from "react-router-dom";
import Item from "../../components/Item";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItem() {
    const item = await fetch(
      `http://localhost:1337/api/items/${itemId}?populate=image`,
      { method: "GET" }
    );
    const itemJson = await item.json();
    setItem(itemJson.data);
  }

  async function getItems() {
    const items = await fetch(
      "http://localhost:1337/api/items?populate=image",
      { method: "GET" }
    );
    const itemsJson = await items.json();
    dispatch(setItems(itemsJson.data));
  }

  useEffect(() => {
    getItem();
    getItems();
    // eslint-disable-next-line
  }, [itemId]);

  let mainPrice = item?.attributes?.price
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Box width={"80%"} margin={"0 auto"}>
      <Box display={"flex"} flexWrap={"wrap"} columnGap={"40px"} pt={"80px"}>
        {/* IMAGES */}
        <Box flex={"1 1 40%"} mb={"40px"}>
          <img
            alt={item?.name}
            width={"100%"}
            height={"100%"}
            src={`http://localhost:1337${item?.attributes?.image?.data?.attributes?.formats?.small?.url}`}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* ACTIONS */}
        <Box flex={"1 1 50%"} mb={"40px"}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box>Home/Item</Box>
            <Box>Prev Next</Box>
          </Box>

          <Box margin={"65px 0 25px 0"}>
            <Typography variant="h3">{item?.attributes?.name}</Typography>
            <Typography>₦{mainPrice}</Typography>
            <Typography sx={{ mt: "20px" }}>
              {item?.attributes?.shortDescription}
            </Typography>
          </Box>

          {/* COUNT AND BUTTON */}
          <Box
            display={"flex"}
            alignItems={"center"}
            minHeight={"50px"}
            mb={"20px"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              border={`1.5px solid ${shades.neutral[300]}`}
              mr={"20px"}
              padding={"2px 5px"}
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ padding: "0 5px" }}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              sx={{
                bgcolor: "#222222",
                borderRadius: 0,
                color: "white",
                padding: "10px 40px",
                minWidth: "150px",
              }}
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
            >
              ADD TO CART
            </Button>
          </Box>

          <Box>
            <Box margin={"2px 0 5px 0"} display={"flex"}>
              <FavoriteBorderOutlinedIcon />
              <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
            </Box>
            <Typography>CATEGORIES: {item?.attributes?.category}</Typography>
          </Box>
        </Box>
      </Box>

      {/* INFORMATION */}
      <Box margin={"20px 0"}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={"DESCRIPTION"} value={"description"} />
          <Tab label={"REVIEWS"} value={"reviews"} />
        </Tabs>
      </Box>
      <Box display={"flex"} flexWrap={"wrap"} gap={"15px"}>
        {value === "description" && (
          <div>{item?.attributes?.longDescription}</div>
        )}
        {value === "reviews" && <div>Reviews</div>}
      </Box>

      {/* RELATED ITEMS */}
      <Box width={"100%"} marginTop={"50px"}>
        <Typography variant="h3" fontWeight={"bold"}>
          Related Products
        </Typography>
        <Box
          mt={"20px"}
          display={"flex"}
          columnGap={"1.33%"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          {items.slice(0, 4).map((item, i) => (
            <Item key={`${item.name}-${i}`} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
