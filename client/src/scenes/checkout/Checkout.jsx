import React from "react";
import { useSelector } from "react-redux";
import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Shipping from "./Shipping";
import { shades } from "../../theme";
import Payment from "./Payment";
import { useNavigate } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";

const initialValues = {
  billingAddress: {
    firstName: "",
    lastName: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
  },
  shippingAddress: {
    isSameAddress: true,
    firstName: "",
    lastName: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
  },
  email: "",
  phoneNumber: "",
};

const checkoutSchema = [
  yup.object().shape({
    billingAddress: yup.object().shape({
      firstName: yup.string().required("required"),
      lastName: yup.string().required("required"),
      country: yup.string().required("required"),
      street1: yup.string().required("required"),
      street2: yup.string(),
      city: yup.string().required("required"),
      state: yup.string().required("required"),
    }),
    shippingAddress: yup.object().shape({
      isSameAddress: yup.boolean(),
      firstName: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required("required"),
      }),
      lastName: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required("required"),
      }),
      country: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required("required"),
      }),
      street1: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required("required"),
      }),
      street2: yup.string(),
      city: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required("required"),
      }),
      state: yup.string().when("isSameAddress", {
        is: false,
        then: yup.string().required("required"),
      }),
    }),
  }),
  yup.object().shape({
    email: yup.string().required("required"),
    phoneNumber: yup.string().required("required"),
  }),
];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cart = useSelector((state) => state.cart.cart);
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;
  const totalPrice = cart.reduce((total, item) => {
    return total + item.count * item.attributes.price;
  }, 0);
  const navigate = useNavigate();

  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1);

    // COPIES BILLING ADDRESS TO SHIPPING ADDRESS
    if (isFirstStep && values.shippingAddress.isSameAddress) {
      actions.setFieldValue("shippingAddress", {
        ...values.billingAddress,
        isSameAddress: true,
      });
    }

    if (isSecondStep) {
      makePayment(values);
    }

    actions.setTouched({});
  };

  async function makePayment(values) {
    const url = "http://localhost:1337/api/orders";
    const requestBody = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      totalPrice,
      streetAddress: values.billingAddress.street1,
      city: values.billingAddress.city,
      state: values.billingAddress.state,
      products: cart.map(({ id, count, attributes }) => ({
        id,
        count,
        attributes,
      })),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const session = await response.json();

    console.log(session);

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: session.publicKey,
      amount: session.totalPrice * 100,
      email: session.email,
      onSuccess(transaction) {
        let message = `Payment Complete! Reference ${transaction.reference}`;
        alert(message);
      },
      onCancel() {
        alert("You have Cancelled the transaction");
      },
    });

    navigate("/checkout/success");
  }

  return (
    <Box width={"80%"} margin={"0px auto"} padding={"100px 0"}>
      <Stepper activeStep={activeStep} sx={{ margin: "20px 0" }}>
        <Step>
          <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>
      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={checkoutSchema[activeStep]}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            setFieldValue,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              {isFirstStep && (
                <Shipping
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}

              {isSecondStep && (
                <Payment
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}

              <Box
                display={"flex"}
                justifyContent={"space-between"}
                gap={"50px"}
              >
                {isSecondStep && (
                  <Button
                    fullWidth
                    color="primary"
                    sx={{
                      bgcolor: shades.primary[200],
                      color: "white",
                      boxShadow: "none",
                      padding: "15px 40px",
                      borderRadius: "0px",
                    }}
                    variant={"contained"}
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  fullWidth
                  type="submit"
                  color="primary"
                  sx={{
                    bgcolor: shades.primary[400],
                    color: "white",
                    boxShadow: "none",
                    padding: "15px 40px",
                    borderRadius: "0px",
                  }}
                  variant={"contained"}
                >
                  {isFirstStep ? "Next" : "PAY NOW"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Checkout;
