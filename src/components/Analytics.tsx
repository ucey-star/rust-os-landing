import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Google Analytics 4, loaded only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * Google Signals and ad personalisation are disabled; GA4 never stores IPs.
 * UTM parameters on the landing URL are attributed automatically by GA4.
 */
export function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
