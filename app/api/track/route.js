import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userAgent = request.headers.get('user-agent') || 'Unknown User-Agent';
    const referrerHeader = request.headers.get('referer') || body.referrer || 'Direct / None';

    // Extract client IP from common headers
    let ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '';

    // Handle local development IP
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
        const ipData = await ipRes.json();
        ip = ipData.ip || ip;
      } catch (e) {
        ip = 'Development-Local-IP';
      }
    }

    // Fetch IP Geolocation info
    let geo = {
      city: 'Unknown City',
      regionName: 'Unknown Region',
      country: 'Unknown Country',
      isp: 'Unknown ISP',
      query: ip,
      mobile: false,
    };

    if (ip && ip !== 'Development-Local-IP') {
      try {
        const geoRes = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,query,mobile,proxy`,
          { cache: 'no-store' }
        );
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
          geo = geoData;
        }
      } catch (e) {
        console.error('Geo IP lookup error:', e);
      }
    }

    // Detect device & Instagram app status
    const isInstagram = /Instagram|FBAN|FBAV/i.test(userAgent);
    let deviceOS = 'Unknown Device';
    if (/iPhone|iPad|iPod/i.test(userAgent)) deviceOS = ' iPhone / iOS';
    else if (/Android/i.test(userAgent)) deviceOS = '🤖 Android';
    else if (/Windows/i.test(userAgent)) deviceOS = '💻 Windows PC';
    else if (/Macintosh|Mac OS X/i.test(userAgent)) deviceOS = '💻 Mac';
    else if (/Linux/i.test(userAgent)) deviceOS = '🐧 Linux';

    const sourceTag = isInstagram
      ? '📸 INSTAGRAM BIO / IN-APP LINK'
      : referrerHeader.includes('instagram')
      ? '📸 INSTAGRAM REFERRAL'
      : '🌐 DIRECT BROWSER / OTHER';

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const message = `
🚨 *NEW VISITOR DETECTED!*

📍 *Location:* ${geo.city}, ${geo.regionName}, ${geo.country}
📶 *ISP / Network:* ${geo.isp}
🌐 *IP Address:* \`${geo.query}\`
📱 *Device:* ${deviceOS}
🏷️ *Source:* ${sourceTag}
🔗 *Referrer:* \`${referrerHeader}\`
⏰ *Time:* ${timestamp}
`.trim();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } else {
      console.warn('Telegram tokens missing in environment variables. Message:', message);
    }

    return NextResponse.json({ success: true, location: geo.city });
  } catch (error) {
    console.error('Visitor Tracking Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
