export function BrandingSection() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between p-12 text-white">
        <div>
          {/* Logo placeholder */}
          <div className="mb-12">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 text-2xl font-bold">SC</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4">Hello Socialians! 👋</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Connect, share, and stay in the loop! Engage with friends, join
            conversations, and express yourself instantly!
          </p>
        </div>

        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} VegaStack (PeerXP). All rights reserved.
        </div>
      </div>
    </div>
  );
}

