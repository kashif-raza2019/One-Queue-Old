import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import QRCodeStyling from 'qr-code-styling';

// render data to the screen
// const testUrl = 'http://localhost:8080/api/_v1/generate/qr-code/12345/200';

// Fetch json data from the servr
// const testUrl = 'http://localhost:8080/api/_v1/generate/qr-code/j23j4jgvjbv/700';
// const QRCODE = fetch(testUrl);

const qrCode = new QRCodeStyling({
  width: 400,
  height: 400,
  type: "svg",
  data: "qrData",
  dotsOptions: {
      color: "#6a1a4c",
      type: "dots",
      gradient: {
          type: "radial",
          rotation: 0,
          colorStops: [
              {
                  offset: 0,
                  color: "#007c7c"
              },
              {
                  offset: 1,
                  color: "#159d9d"
              }
          ]
      }
  },
  backgroundOptions: {
      color: "#ffffff",
  },
  imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0
  },
  dotsOptionsHelper: {
      colorType: {
          single: true,
          gradient: false
      },
      gradient: {
          linear: true,
          radial: false,
          color1: "#6a1a4c",
          color2: "#6a1a4c",
          rotation: 0
      }
  },
  cornersSquareOptions: {
      type: "dot",
      color: "#007c7c"
  },
  cornersSquareOptionsHelper: {
      colorType: {
          single: true,
          gradient: false
      },
      gradient: {
          linear: true,
          radial: false,
          color1: "#000000",
          color2: "#000000",
          rotation: 0
      }
  },
  cornersDotOptions: {
      type: "",
      color: "#007c7c"
  },
  cornersDotOptionsHelper: {
      colorType: {
          single: true,
          gradient: false
      },
      gradient: {
          linear: true,
          radial: false,
          color1: "#000000",
          color2: "#000000",
          rotation: 0
      }
  },
  backgroundOptionsHelper: {
      colorType: {
          single: true,
          gradient: false
      },
      gradient: {
          linear: true,
          radial: false,
          color1: "#ffffff",
          color2: "#ffffff",
          rotation: 0
      }
  }
});

function App() {
  const [url, setUrl] = useState("https://kashifraza.herokuapp.com/");
  const ref = useRef(null);

  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: url
    });
  }, [url]);
  
  return (
    <div className="App">
      <div>
      </div>
    <div ref={ref} />
    </div>
  );
}

export default App;
