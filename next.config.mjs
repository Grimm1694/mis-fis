/** @type {import('next').NextConfig} */
  const nextConfig = {};
  export default {
    async rewrites() {
      return [
        {
          source: "/api/send-sms",
          destination: "https://api.mavyah.com/api/v2/SendSMS",
        },
      ];
    },
  };

 nextConfig; 




