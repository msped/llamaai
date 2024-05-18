import Provider from "../../Provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body>
          {children}
        </body>
      </Provider>
    </html>
  );
}
