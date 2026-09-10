import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaGithub,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-20">

            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                <div>
                    <h1 className="text-3xl font-bold text-blue-400">
                        ShopHub
                    </h1>

                    <p className="text-gray-400 mt-4 leading-7">
                        ShopHub is your one-stop destination for Electronics,
                        Fashion, Home Essentials, Beauty, Books and much more.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-5">
                        Company
                    </h2>

                    <ul className="space-y-3 text-gray-400">
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Blog</li>
                        <li>Contact</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-5">
                        Support
                    </h2>

                    <ul className="space-y-3 text-gray-400">
                        <li>Help Center</li>
                        <li>Returns</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-5">
                        Follow Us
                    </h2>

                    <div className="flex gap-5 text-2xl">

                        <FaFacebook className="hover:text-blue-500 cursor-pointer transition" />

                        <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />

                        <FaLinkedin className="hover:text-blue-400 cursor-pointer transition" />

                        <FaGithub className="hover:text-gray-300 cursor-pointer transition" />

                    </div>

                </div>

            </div>

            <div className="border-t border-gray-700">

                <p className="text-center text-gray-400 py-5">
                    © 2026 ShopHub. All Rights Reserved.
                </p>

            </div>

        </footer>
    );
}

export default Footer;