import React from "react";
import Header from "./Header";
import { Container } from "@material-ui/core";
// next js helper function used to add files to head tag of html doc
import Head from "next/head";

const Layout = (props) => {
  return (
    <Container>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>

      
      <Header />
      <div style={{ marginTop: "120px" }}></div>
      {props.children}
    </Container>
  );
};
export default Layout;
