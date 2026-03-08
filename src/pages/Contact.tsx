import { Helmet } from "react-helmet-async"
import ContactForm from "../components/forms/ContactForm"
const Contact = () => {
  return (
    <>
      <Helmet>
        <title>
          Contact | Mobje Commerce
        </title>
      </Helmet>
      <section id="breadcrums" className="px-4">
        <div className="lg:py-14 py-6 container mx-auto">
          <h2 className="text-4xl font-semibold mb-4 text-center">Get In Touch</h2>
            <p className="text-center text-slate-500 md:text-sm text-xs">
              Have a question about your order, our sizing, or just want to say hi?
              <br />
              We'd love to hear from you. Drop us a message below.
            </p>
        </div>
      </section>
      <section className='w-full bg-white flex justify-center items-center px-4 lg:py-14 py-6'>
        <ContactForm />
      </section>
    </>
  )
}

export default Contact