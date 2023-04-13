import React from "react";

const Page = ({ images }) => {
  return (
    <div style={styles.container}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          style={styles.image}
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#ffffff", // set background color as needed
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    marginBottom: 16, // add margin between images as needed
  },
};

export default Page;
