'use client'
export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .733.592 1.324 1.325 1.324h11.488v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.462.098 2.793.143v3.24h-1.917c-1.504 0-1.796.714-1.796 1.763v2.313h3.59l-.467 3.622h-3.123v9.294h6.116c.733 0 1.325-.591 1.325-1.324v-21.35c0-.733-.592-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M24 4.557c-.883.39-1.832.654-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.955-2.178-1.55-3.594-1.55-2.723 0-4.928 2.205-4.928 4.927 0 .386.043.762.127 1.124-4.094-.205-7.725-2.166-10.148-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.215 2.188 4.099-.808-.026-1.568-.248-2.228-.617v.062c0 2.385 1.697 4.374 3.946 4.827-.413.112-.849.171-1.296.171-.318 0-.626-.031-.927-.089.626 1.956 2.444 3.379 4.6 3.418-1.68 1.318-3.809 2.105-6.115 2.105-.397 0-.789-.023-1.176-.068 2.179 1.396 4.768 2.21 7.548 2.21 9.051 0 14.001-7.496 14.001-13.986 0-.213-.005-.425-.014-.636.962-.694 1.8-1.56 2.462-2.548l-.047-.02z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M22.225 0h-20.449c-.978 0-1.776.798-1.776 1.776v20.448c0 .979.798 1.776 1.776 1.776h20.449c.978 0 1.775-.798 1.775-1.776v-20.448c0-.979-.797-1.776-1.775-1.776zm-15.847 20.452h-3.654v-12.084h3.654v12.084zm-1.826-13.717c-1.168 0-2.116-.947-2.116-2.116s.948-2.115 2.116-2.115c1.168 0 2.115.947 2.115 2.115s-.947 2.116-2.115 2.116zm15.168 13.717h-3.654v-5.842c0-1.391-.028-3.182-1.94-3.182-1.94 0-2.238 1.515-2.238 3.081v5.943h-3.654v-12.084h3.504v1.649h.049c.489-.924 1.68-1.897 3.457-1.897 3.694 0 4.373 2.432 4.373 5.595v6.737z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    );
  }
  