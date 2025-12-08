import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      {/* Footer Section */}
      <footer className="flex flex-col md:flex-row  mt-5 bg-white justify-between py-6 border-t-3 border-[#243E36FF]  px-3 md:px-6">
        <div className="flex flex-col gap-4 items-center md:items-start md:w-1/2">
          <h5 className="text-lg font-bold">Contact Us</h5>
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
          <div className="flex gap-3 items-center" aria-label="Social links">
            <Link
              to="https://wa.me/2348093223489"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.86 11.86 0 0012.06.5 11.73 11.73 0 00.5 12.06c0 2.07.54 3.95 1.49 5.63L.5 23.5l5.89-1.55A11.78 11.78 0 0012.06 23.5 11.86 11.86 0 0020.52 3.48zM12.06 21.5a9.2 9.2 0 01-4.66-1.24l-.34-.2-3.49.92.93-3.4-.21-.35A9.16 9.16 0 111.22 7.6a9.08 9.08 0 019.16 13.9zM17.06 14.95c-.25-.12-1.49-.74-1.72-.82-.23-.09-.4-.12-.57.12s-.66.82-.81.99-.3.17-.55.05a7.92 7.92 0 01-2.32-1.42 8.26 8.26 0 01-1.54-1.9c-.16-.27 0-.42.12-.54.12-.12.25-.3.37-.45.12-.16.16-.27.25-.45.09-.18 0-.34-.04-.45-.12-.28-.57-.61-.83-.83-.23-.2-.5-.17-.69-.17-.18 0-.36 0-.55 0s-.45.06-.68.28c-.23.23-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.6.12.16 1.77 2.75 4.3 3.86 2.52 1.11 2.52.74 2.97.69.45-.06 1.49-.61 1.7-1.2.22-.6.22-1.12.15-1.23-.07-.12-.23-.16-.48-.28z" />
              </svg>{" "}
            </Link>
            <Link
              to="https://twitter.com/intent/tweet?text=Check%20out%20Swiss-Hub%20https://swisshub.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012.09 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5.5 20 0 20-11.5v-.5A7.72 7.72 0 0023 3z" />
              </svg>
            </Link>

            <Link
              to="https://github.com/Joshua-ID/swiss-hub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.01-1.99-3.2.7-3.88-1.39-3.88-1.39-.53-1.35-1.29-1.71-1.29-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.76.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.19 1.18a11.12 11.12 0 012.9-.39c.98.01 1.97.13 2.89.39 2.21-1.5 3.18-1.18 3.18-1.18.63 1.6.23 2.78.11 3.07.74.8 1.19 1.83 1.19 3.1 0 4.44-2.7 5.42-5.28 5.7.42.35.79 1.05.79 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A11.51 11.51 0 0023.5 12c0-6.27-5.23-11.5-11.44-11.5z" />
              </svg>
            </Link>

            <Link
              to="https://www.linkedin.com/in/joshua-idara-31954383/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-14h4v2.5a4 4 0 014-2.5zM2 9h4v14H2zM4 0a2 2 0 110 4 2 2 0 010-4z" />
              </svg>
            </Link>
          </div>
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
