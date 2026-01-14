import { Helmet } from "react-helmet-async"
import ChangePasswordForm from "../../components/forms/ChangePasswordForm"

const ChangePassword = () => {
  return (
    <>
      <Helmet>
        <title>
          Reset Password | Set a New Password | Mobje Commerce
        </title>
      </Helmet>
      <h2 className="font-bold mb-8 md:mb-16">Change Password</h2>
      <div className="mb-8 w-full md:w-[320px]">
        <ChangePasswordForm />
      </div>
    </>)
}

export default ChangePassword