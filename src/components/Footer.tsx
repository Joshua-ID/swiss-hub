export default function Footer() {
  return (
    <>
      {/* Footer Section */}
      <footer className="flex flex-col md:flex-row items-center justify-between py-6 border-t-3 border-[#243E36FF]  px-3 md:px-">
        <div className="flex flex-col items-center md:items-start md:w-1/2">
          <h5 className="text-lg font-bold mb-2">Contact Us</h5>
          <address className="not-italic text-gray-600">
            <p>
              Lagos Island, <br />
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+2348093223489" className="hover:underline">
                +234 809 3223 489
              </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:info@example.com" className="hover:underline">
                info@swisshub.com
              </a>
            </p>
          </address>
        </div>
        <div className="flex flex-col gap-3 justify-between">
          <div className="flex flex-col items-center md:items-start md:max-w-2xl">
            <p className="text-xl font-bold mb-2">About Us</p>
            <p className="text-gray-600">
              We are an online learning platform dedicated to providing
              high-quality courses and resources to help individuals achieve
              their goals.
            </p>
          </div>
          <span>&copy; Swiss-Hub {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
