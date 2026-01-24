import { Helmet } from "react-helmet-async"

const PageNotFound = () => {
  return (
    <div className="py-32">
      <Helmet>
        <title>404  | Page Not Found  | Mobje Commerce</title>
      </Helmet>
      <h1 className='text-7xl text-center font-bold '>Page not found</h1>
    </div>

  )
}

export default PageNotFound