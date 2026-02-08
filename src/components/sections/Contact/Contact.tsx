"use client";

import { content } from "@/content";
import { AnimatedWaterEffects } from "@/components/water";
import { useInView } from "@/hooks/useInView";

export function Contact() {
  const contactInfo = content.contact;
  const social = content.social;
  const [avatarRef, isAvatarInView] = useInView<HTMLImageElement>({ threshold: 0.5, once: false });

  // Build contact links array (excluding youtube and zalo)
  const contactLinks = [
    { label: 'Gmail', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
    { label: 'GitHub', value: 'tqdat410', href: social.github },
    { label: 'LinkedIn', value: 'tqdat410', href: social.linkedin },
    { label: 'Facebook', value: 'tqdat410', href: social.facebook },
    { label: 'X', value: '@trandat40', href: social.x },
    { label: 'Instagram', value: '@datdatdat_410', href: social.instagram },
    { label: 'Telegram', value: '@tqdat410', href: social.telegram },
    { label: 'Upwork', value: 'tqdat410', href: social.upwork },
    { label: 'Reddit', value: 'u/Fun_Pudding818', href: social.reddit },
    { label: 'Discord', value: 'tqdat410', href: social.discord },
    { label: 'Linktree', value: 'tqdat410', href: contactInfo.linktree },
  ].filter(link => link.href && link.href.length > 0);

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
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/4 z-10 w-full px-8 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Avatar Image - grayscale default, color on hover OR when in view */}
          <img 
            ref={avatarRef}
            src="https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto/v1764227148/profile2_hwusuq.png"
            alt="Profile"
            className={`w-72 h-72 md:w-96 md:h-96 object-cover transition-all duration-500 hover:grayscale-0 ${isAvatarInView ? 'grayscale-0' : 'grayscale'}`}
          />

          {/* Contact Info List - 3 columns grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 text-right">
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
