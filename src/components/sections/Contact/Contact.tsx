"use client";

import { content } from "@/content";
import { AnimatedWaterEffects } from "@/components/water";
import { useInView } from "@/hooks/useInView";
import { useIsMobile } from "@/hooks/useMediaQuery";

export function Contact() {
  const contactInfo = content.contact;
  const social = content.social;
  const isMobile = useIsMobile();
  const [avatarRef, isAvatarInView] = useInView<HTMLImageElement>({ threshold: 0.5, once: false });

  // Build contact links array - mobile shows essential links only
  const allContactLinks = [
    { label: 'Gmail', value: contactInfo.email, href: `mailto:${contactInfo.email}`, mobile: true },
    { label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}`, mobile: true },
    { label: 'GitHub', value: 'tqdat410', href: social.github, mobile: true },
    { label: 'LinkedIn', value: 'tqdat410', href: social.linkedin, mobile: true },
    { label: 'Facebook', value: 'tqdat410', href: social.facebook, mobile: false },
    { label: 'X', value: '@trandat40', href: social.x, mobile: false },
    { label: 'Instagram', value: '@datdatdat_410', href: social.instagram, mobile: false },
    { label: 'Telegram', value: '@tqdat410', href: social.telegram, mobile: false },
    { label: 'Upwork', value: 'tqdat410', href: social.upwork, mobile: false },
    { label: 'Reddit', value: 'u/Fun_Pudding818', href: social.reddit, mobile: false },
    { label: 'Discord', value: 'tqdat410', href: social.discord, mobile: false },
    { label: 'Linktree', value: 'tqdat410', href: contactInfo.linktree, mobile: true },
  ].filter(link => link.href && link.href.length > 0);

  const contactLinks = isMobile
    ? allContactLinks.filter(link => link.mobile)
    : allContactLinks;

  return (
    <section id="contact" className="relative h-screen w-full overflow-hidden">
      {/* Background Water Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatedWaterEffects 
          name="Get in touch" 
          nameColor="#0f172a"
          fontSize={80} 
          textY={0.25}
        />
      </div>

      {/* Content: Image Left + Contact List Right */}
      <div className="absolute top-[55%] md:top-1/2 left-0 right-0 -translate-y-1/4 z-10 w-full px-4 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12">
          {/* Avatar Image - grayscale default, color on hover OR when in view */}
          <img
            ref={avatarRef}
            src="https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764227148/profile2_hwusuq.png"
            alt="Profile"
            className={`w-48 h-48 md:w-96 md:h-96 object-cover transition-all duration-500 hover:grayscale-0 ${isAvatarInView ? 'grayscale-0' : 'grayscale'}`}
          />

          {/* Contact Info List - 3 columns grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 text-right">
            {contactLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                className="group/item relative text-text-primary hover:text-white transition-colors duration-400 text-base md:text-lg px-3 py-1 overflow-hidden"
              >
                {/* Background effect - grows from bottom-right */}
                <span className="absolute right-0 bottom-0 w-0 h-0 bg-slate-800 -z-10 group-hover/item:w-full group-hover/item:h-full [transition:width_400ms_ease-out,height_1000ms_ease-out]" />
                <span className="relative z-10">{link.label} : {link.value}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
