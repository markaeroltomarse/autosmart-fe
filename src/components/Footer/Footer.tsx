import Link from 'next/link';
import { AiFillFacebook } from 'react-icons/ai';

function Footer() {
  return (
    <footer className="bg-autosmartBlue text-white bg-slate-800 py-10 !z-10">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="list-disc list-inside">
              <li>Autosmart Automotive Supply, De Venecia Highway 2418</li>
              <li>Calasiao, Philippines</li>
              <li>Phone: (+63) 9760091800</li>
              <li>Email: autosmartph@gmail.com</li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>

            <Link target='_blank' href="https://www.facebook.com/aceautomotiveparts">
              <AiFillFacebook size={30} color="orange" />
            </Link>

            <ul className="flex">
              <li className="mr-6">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li className="mr-6">
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="list-disc list-inside">
              <li>
                <a href="#">Terms of Use</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
            <p className="mt-4">
              &copy; 2023 Autosmart Philippines. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
