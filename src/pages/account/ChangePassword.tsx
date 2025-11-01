import ChangePasswordForm from "../../components/forms/ChangePasswordForm"

const ChangePassword = () => {
  return (
    <>
      <h2 className="font-bold mb-8 md:mb-16">Change Password</h2>
      <div className="mb-8 w-full md:w-[320px]">
        <ChangePasswordForm />
      </div>
    </>)
}

export default ChangePassword