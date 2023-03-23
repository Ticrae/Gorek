import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state/index";
import { useNavigate } from "react-router-dom";

const Item = ({ item, width }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const {
    palette: { neutral },
  } = useTheme();
  const { category, name, price, image } = item.attributes;
  const {
    data: {
      attributes: {
        formats: {
          small: { url },
        },
      },
    },
  } = image;

  let categorys = undefined;
  if (category) {
    categorys = category
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  let mainPrice = price
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Box width={width}>
      <Box
        position={"relative"}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        <img
          alt={item.name}
          width={"300px"}
          height={"400px"}
          src={`http://localhost:1337${url}`}
          onClick={() => navigate(`/item/${item.id}`)}
          style={{ cursor: "pointer" }}
        />
        <Box
          display={isHovered ? "block" : "none"}
          position={"absolute"}
          bottom={"10%"}
          left={"0"}
          padding={"0 5%"}
          width={"100%"}
        >
          <Box display={"flex"} justifyContent={"space-between"}>
            {/* AMOUNT */}
            <Box
              display={"flex"}
              alignItems={"center"}
              borderRadius={"3px"}
              bgcolor={shades.neutral[100]}
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography color={shades.primary[300]}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            {/* BUTTON */}
            <Button
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
              sx={{ backgroundColor: shades.primary[300], color: "white" }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      <Box mt={"3px"}>
        <Typography variant="subtitle2" color={neutral.dark}>
          {categorys}
        </Typography>
        <Typography>{name}</Typography>
        <Typography fontWeight={"bold"}>₦{mainPrice}</Typography>
      </Box>
    </Box>
  );
};

export default Item;
