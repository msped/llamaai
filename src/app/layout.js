import Provider from "../../Provider";
import Header from "@/components/Header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body>
          <Header />
          {children}
          {/* <Footer /> */}
        </body>
      </Provider>
    </html>
  );
}
