import DashboardTopbar from './DashboardTopbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardTopbar />
      {children}
    </>
  );
}
