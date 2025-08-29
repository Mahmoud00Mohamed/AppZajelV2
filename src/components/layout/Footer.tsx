import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Logo from "../ui/Logo";

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-purple-50 pt-12 pb-6 relative">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Logo />
            <p className="mt-4 text-stone-600 text-sm leading-relaxed max-w-xs">
              {t("footer.aboutDescription")}
            </p>
            <div className="mt-6 flex space-x-4 rtl:space-x-reverse">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="text-stone-500 hover:text-purple-600 transition-colors duration-300"
                  aria-label={t(`footer.socialMedia.${index}`)}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-purple-800 mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {["about", "contact", "faq", "delivery", "returns"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to={`/${link}`}
                      className="text-stone-600 hover:text-purple-600 transition-colors duration-300 text-sm"
                    >
                      {t(`footer.${link}`)}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-purple-800 mb-4">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2">
              {["terms", "privacy"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link}`}
                    className="text-stone-600 hover:text-purple-600 transition-colors duration-300 text-sm"
                  >
                    {t(`footer.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-purple-800 mb-4">
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin
                  size={18}
                  className={`text-purple-600 ${
                    isRtl ? "ml-2" : "mr-2"
                  } mt-0.5`}
                />
                <span className="text-stone-600 text-sm">
                  {t("footer.location")}
                </span>
              </li>
              <li className="flex items-center">
                <Phone
                  size={18}
                  className={`text-purple-600 ${isRtl ? "ml-2" : "mr-2"}`}
                />
                <span className="text-stone-600 text-sm">+20 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail
                  size={18}
                  className={`text-purple-600 ${isRtl ? "ml-2" : "mr-2"}`}
                />
                <span className="text-stone-600 text-sm">
                  info@zajilalsaadah.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-stone-500 text-sm">{t("footer.copyright")}</p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`absolute bottom-6 ${
          isRtl ? "left-4 sm:left-6" : "right-4 sm:right-6"
        } z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md text-purple-600 rounded-full flex items-center justify-center shadow-md border border-purple-200/50 transition-colors duration-300 hover:bg-purple-100`}
        aria-label={t("common.scrollToTop")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
};

export default React.memo(Footer);
