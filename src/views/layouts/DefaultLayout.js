import Header from '../../components/Header'

function DefaultLayout({ children }) {
  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      <Header />
      <div className="body">{children}</div>
    </div>
  )
}

export default DefaultLayout
