import Document, { Html, Head, Main, NextScript } from 'next/document'
/**
 * Html => tag <html>
 * Head => tag <head>
 * Main => todo conteúdo da aplicação será renderizado no Main
 * NextSript => é onde o Next de forma automática injetará os arquivos ".js"
 */

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="favicon.png" type="image/png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}