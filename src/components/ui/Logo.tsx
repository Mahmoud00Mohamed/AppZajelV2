import React from "react";
import { useTranslation } from "react-i18next";
// لم نعد بحاجة لـ Gift
// import { Gift } from "lucide-react";

import PigeonIcon from "/photo/Logo.svg"; // ← استيراد SVG كصورة

interface LogoProps {
  small?: boolean;
}

const Logo: React.FC<LogoProps> = ({ small = false }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="flex items-center">
      <div className="text-primary">
        <img
          src={PigeonIcon}
          alt="Pigeon Icon"
          width={small ? 28 : 32}
          height={small ? 28 : 32}
        />
      </div>
      <div className={`${small ? "ml-1.5" : "ml-2"} rtl:mr-2 rtl:ml-0`}>
        <h1
          className={`font-bold ${small ? "text-lg" : "text-xl"} text-primary`}
        >
          {isArabic ? "زاجل السعادة" : "Zajil Al-Sa'adah"}
        </h1>
        {!small && (
          <p className="text-xs text-gray-500 -mt-1">
            {isArabic ? "هدايا مميزة" : "Premium Gifts"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;
