export const text = {
  app: {
    title: "IP CHECKER",
    subtitle: "🔍 Your Public IP Address 🌐",
    poweredByPrefix: "⚡ Powered by",
    poweredByAnd: "and",
  },
  ipDisplay: {
    cardDescription: "Your current public IP address information",
    errorPrefix: "⚠️ ",
    noIpFound: "🤔 No IP addresses found",
    ipv4Label: "IPv4:",
    ipv6Label: "IPv6:",
    fetchLoading: "🔄 Fetching...",
    refreshButton: "Refresh IP",
    toastCopiedSuffix: " copied!",
    toastCopyFailed: "Failed to copy",
    toastCopyFailedDescription: "Unable to copy IP address to clipboard",
    fetchNoneError: "Unable to fetch any IP addresses",
    fetchIPv4Warn: "Failed to fetch IPv4:",
    fetchIPv6Warn: "Failed to fetch IPv6:",
  },
  links: {
    publicIp: {
      label: "public-ip",
      href: "https://github.com/sindresorhus/public-ip",
    },
    retroUi: {
      label: "RetroUI",
      href: "https://www.retroui.dev",
    }
  }
} as const

export type TextConfig = typeof text

