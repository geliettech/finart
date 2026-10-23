import { CapabilityUnavailable, StaffPageHeader, StaffPanel } from "@/components/staff/StaffUI";
import { staffCapabilities } from "@/pages/staff/staffCapabilities";

const StaffCapabilityPage = ({ capability }) => {
  const page = staffCapabilities[capability];
  if (!page) {
    throw new Error(`Unknown staff capability: ${capability}`);
  }

  return (
    <>
      <StaffPageHeader title={page.title} description={page.description} />
      <StaffPanel title="Service availability" description="This workspace does not make privileged client-side Firestore queries or perform unsupported administrative actions.">
        <CapabilityUnavailable title={page.title} endpoint={page.endpoint} description={page.detail} />
      </StaffPanel>
    </>
  );
};

export default StaffCapabilityPage;
