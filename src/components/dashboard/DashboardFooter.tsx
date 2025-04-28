export default function DashboardFooter() {
    return (
      <div className="mt-12 bg-white border-t border-gray-300 pt-6 text-gray-700 text-sm max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <div className="w-32 h-2 bg-red-600 mb-2" />
          <h2 className="text-xl font-bold text-black leading-tight">
            Student Recreation Center
          </h2>
          <p className="text-gray-500 mb-2">University Student Union</p>
          <hr className="my-2 border-gray-300" />
          <p className="font-semibold text-black">University Student Union</p>
          <p>18111 Nordhoff Street</p>
          <p>Northridge, CA 91330-8449</p>
          <p className="mt-2">
            <span className="font-semibold text-black">Phone:</span> (818)
            677-5434
          </p>
          <p className="text-red-600 underline mt-2 cursor-pointer hover:text-red-700">
            Send email
          </p>
  
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-md font-bold text-black">Building Hours</h3>
              <p>Mon–Fri: 6 a.m. – 10 p.m.</p>
              <p>Sat–Sun: 9 a.m. – 5 p.m.</p>
            </div>
  
            <div>
              <h3 className="text-md font-bold text-black">Rec Pool</h3>
              <p>
                <em>Jan 18 – Mar 16</em>: Mon–Fri: 6 a.m. – 7 p.m.
                <br />
                Sat–Sun: 9 a.m. – 4:30 p.m.
              </p>
              <p className="mt-1">
                <em>Mar 17 – May 11</em>: Mon–Fri: 6 a.m. – 9:30 p.m.
                <br />
                Sat–Sun: 9 a.m. – 4:30 p.m.
              </p>
            </div>
  
            <div>
              <h3 className="text-md font-bold text-black">Ridge Rock Wall</h3>
              <p>
                Mon–Fri: 2 – 9 p.m.
                <br />
                Sat: Noon – 4 p.m.
                <br />
                Sun: Closed
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }