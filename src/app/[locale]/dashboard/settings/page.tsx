import { PolicyEditor } from './policy-editor'

const DashboardSettings = () => {
  return (
    <div className="space-y-12">
      <PolicyEditor
        kind="privacy-policy"
        title="Privacy Policy"
        description="Define your website privacy policy that users will see during sign up"
        placeholder="Write down your privacy text here..."
      />
      <PolicyEditor
        kind="terms-and-conditions"
        title="Terms & Conditions"
        description="Define your website terms & conditions that users will see during sign up"
        placeholder="Write down your terms text here..."
        allowNewBox
      />
    </div>
  )
}

export default DashboardSettings
