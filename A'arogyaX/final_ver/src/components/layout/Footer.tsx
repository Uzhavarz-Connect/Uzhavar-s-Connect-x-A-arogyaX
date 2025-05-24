
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/placeholder.svg" alt="HealthVerse Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-medical-blue">HealthVerse</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Connecting healthcare professionals and patients worldwide to provide better care through technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-medical-blue">Help Center</Link>
              </li>
              <li>
                <Link to="/guides" className="text-sm text-gray-600 hover:text-medical-blue">Guides</Link>
              </li>
              <li>
                <Link to="/api" className="text-sm text-gray-600 hover:text-medical-blue">API Documentation</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-medical-blue">About</Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 hover:text-medical-blue">Careers</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-medical-blue">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-medical-blue">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-medical-blue">Terms of Service</Link>
              </li>
              <li>
                <Link to="/hipaa" className="text-sm text-gray-600 hover:text-medical-blue">HIPAA Compliance</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} HealthVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
