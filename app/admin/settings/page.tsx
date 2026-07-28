import { Badge } from '@/components/ui'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-white-500/20 pb-6">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Platform Configuration
        </span>
        <h1 className="font-cormorant text-display-lg text-white-100 font-light">
          System Settings
        </h1>
      </div>

      <div className="bg-bg-surface border border-white-500/20 p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-white-500/20 pb-4">
          <div>
            <h3 className="font-cormorant text-heading-md text-white-100 font-light">
              Payment Gateway
            </h3>
            <p className="text-xs text-white-400 font-light">Razorpay INR Integration</p>
          </div>
          <Badge variant="success">ACTIVE (TEST / PRODUCTION READY)</Badge>
        </div>

        <div className="flex justify-between items-center border-b border-white-500/20 pb-4">
          <div>
            <h3 className="font-cormorant text-heading-md text-white-100 font-light">
              Database Provider
            </h3>
            <p className="text-xs text-white-400 font-light">MongoDB Atlas via Prisma ORM</p>
          </div>
          <Badge variant="gold">CONNECTED</Badge>
        </div>

        <div className="flex justify-between items-center border-b border-white-500/20 pb-4">
          <div>
            <h3 className="font-cormorant text-heading-md text-white-100 font-light">
              Image Storage CDN
            </h3>
            <p className="text-xs text-white-400 font-light">Cloudinary Image Transformation</p>
          </div>
          <Badge variant="gold">CONNECTED</Badge>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-cormorant text-heading-md text-white-100 font-light">
              Transactional Email
            </h3>
            <p className="text-xs text-white-400 font-light">Resend Email API</p>
          </div>
          <Badge variant="gold">CONFIGURED</Badge>
        </div>
      </div>
    </div>
  )
}
