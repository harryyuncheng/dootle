import Image from 'next/image';
import DootleLogo from '../../public/Dootle.png';

interface NavBarProps {
  onHomeClick: () => void;
}

export default function NavBar({ onHomeClick }: NavBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <button
            onClick={onHomeClick}
            className="cursor-pointer"
          >
            <Image src={DootleLogo} alt="Dootle Logo" height={50} />
          </button>
        </div>
      </div>
    </nav>
  );
}
