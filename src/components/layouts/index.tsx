export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default Layout;
