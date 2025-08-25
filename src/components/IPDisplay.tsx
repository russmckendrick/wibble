import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { publicIpv4, publicIpv6 } from "public-ip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/retroui/Card"
import { Button } from "@/components/retroui/Button"
import { RefreshCw, Globe, Loader2, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { text } from "@/config/text"

interface IPInfo {
  ipv4?: string
  ipv6?: string
}

interface CopiedState {
  ipv4: boolean
  ipv6: boolean
}

const cardVariants: any = {
  hidden: { opacity: 0, scale: 0.8, rotateX: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const rowVariants: any = {
  hidden: { opacity: 0, x: -50, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: 50,
    scale: 0.9,
    transition: { duration: 0.3 }
  }
}

interface RowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const Row = ({ children, className, onClick }: RowProps) => (
  <motion.div
    className={className}
    variants={rowVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    whileHover={{
      boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
      transition: { duration: 0.2 }
    } as any}
    onClick={onClick}
    layout
  >
    {children}
  </motion.div>
)


export function IPDisplay() {
  const [ipInfo, setIpInfo] = React.useState<IPInfo>({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState<CopiedState>({ ipv4: false, ipv6: false })

  const copyToClipboard = React.useCallback(async (value: string, type: 'ipv4' | 'ipv6') => {
    try {
      await (navigator as any).clipboard?.writeText(value)
      setCopied(prev => ({ ...prev, [type]: true }))
      
      // Show toast notification
      toast.success(`${type.toUpperCase()}${text.ipDisplay.toastCopiedSuffix}`, {
        description: value,
      })
      
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (err) {
      console.error(`${text.ipDisplay.toastCopyFailed} `, err)
      toast.error(text.ipDisplay.toastCopyFailed, {
        description: text.ipDisplay.toastCopyFailedDescription,
      })
    }
  }, [])

  const fetchIPs = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const results: IPInfo = {}
      
      // Fetch IPv4
      try {
        results.ipv4 = await publicIpv4()
      } catch (err) {
        console.warn(text.ipDisplay.fetchIPv4Warn, err)
      }
      
      // Fetch IPv6
      try {
        results.ipv6 = await publicIpv6()
      } catch (err) {
        console.warn(text.ipDisplay.fetchIPv6Warn, err)
      }
      
      if (!results.ipv4 && !results.ipv6) {
        throw new Error(text.ipDisplay.fetchNoneError)
      }
      
      setIpInfo(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : text.ipDisplay.fetchNoneError)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchIPs()
  }, [fetchIPs])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          scale: 1.02,
          boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
          transition: { duration: 0.2 }
        } as any}
      >
        <Card className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CardDescription className="text-base">
                {text.ipDisplay.cardDescription}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  className="p-4 text-sm text-red-700 bg-red-100 border-2 border-red-500 rounded-lg font-bold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {text.ipDisplay.errorPrefix}{error}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!error && (
              <div className="space-y-3">
                <AnimatePresence>
                  {ipInfo.ipv4 && (
                    <Row className="flex flex-col sm:flex-row sm:items-center p-4 bg-lime-100 border-2 border-black rounded-lg gap-2">
                      <span className="font-mono text-lg font-bold">{text.ipDisplay.ipv4Label}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <motion.span 
                          className="font-mono text-lg font-bold flex-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {ipInfo.ipv4}
                        </motion.span>
                        <Button
                          onClick={() => copyToClipboard(ipInfo.ipv4!, 'ipv4')}
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                        >
                          {copied.ipv4 ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </Row>
                  )}
                  
                  {ipInfo.ipv6 && (
                    <Row className="flex flex-col sm:flex-row sm:items-center p-4 bg-purple-100 border-2 border-black rounded-lg gap-2">
                      <span className="font-mono text-lg font-bold">{text.ipDisplay.ipv6Label}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <motion.span 
                          className="font-mono text-lg font-bold break-all flex-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {ipInfo.ipv6}
                        </motion.span>
                        <Button
                          onClick={() => copyToClipboard(ipInfo.ipv6!, 'ipv6')}
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                        >
                          {copied.ipv6 ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </Row>
                  )}
                  
                  {!loading && !ipInfo.ipv4 && !ipInfo.ipv6 && (
                    <motion.div
                      className="text-center text-gray-600 font-bold py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {text.ipDisplay.noIpFound}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <Row 
              className={`flex flex-col sm:flex-row sm:items-center justify-center p-4 bg-cyan-100 border-2 border-black rounded-lg gap-2 w-full cursor-pointer text-lg font-bold ${loading ? 'opacity-80 cursor-wait pointer-events-none' : ''}`}
              onClick={() => !loading && fetchIPs()}
            >
              <div className="flex items-center justify-center">
                <AnimatePresence initial={false} mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center"
                    >
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {text.ipDisplay.fetchLoading}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      {text.ipDisplay.refreshButton}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Row>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}