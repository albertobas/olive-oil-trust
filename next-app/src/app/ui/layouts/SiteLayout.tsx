import Header from 'next-app/src/app/ui/layouts/Header';

const SiteLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};
export default SiteLayout;
