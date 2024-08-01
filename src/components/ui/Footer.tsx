import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link href={href} className="hover:text-blue-600 transition-colors duration-200 flex items-center group">
    {children}
    <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
  </Link>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-16 px-4 md:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              lingvist<span className="text-blue-600">.</span>
            </h2>
            <p className="text-lg font-light max-w-md">
              Vi hjælper dig med at få meget mere ud af dine dokumenter.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <p className="text-gray-600">Email: <a href="mailto:kontakt@lingvist.dk" className="hover:text-blue-600 transition-colors duration-200">kontakt@lingvist.dk</a></p>
            <p className="text-gray-600">CVR-nummer: 44532263</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <nav className="flex flex-col space-y-2">
              <NavLink href="/priser">Priser</NavLink>
              <NavLink href="mailto:kontakt@lingvist.dk">Kontakt os</NavLink>
              <NavLink href="/terms">Handelsbetingelser</NavLink>
              <NavLink href="/privacy">Privatlivspolitik</NavLink>
            </nav>
          </div>
        </div>
        <hr className="border-gray-200 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>2024 - lingvist.</p>
          <p className="mt-4 md:mt-0">Designet af <a href="https://webnord.dk" className="hover:text-blue-600 transition-colors duration-200">webnord.dk</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;