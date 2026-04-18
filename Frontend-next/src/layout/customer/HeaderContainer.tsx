"use client";

import { useState, useEffect } from "react";
import CustomerHeader from "./AppHeader";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";
import { BrandResponseDto } from "@/src/services/customer/home/customer.service";

interface HeaderContainerProps {
  initialCategories?: CategoryResponseDto[];
  initialBrands?: BrandResponseDto[];
  children?: React.ReactNode;
}

// This component handles scroll detection and passes it to the header
export default function HeaderContainer({
  initialCategories = [],
  initialBrands = [],
  children
}: HeaderContainerProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isOverThreshold = window.scrollY > 10;
      // Only update if value actually changed (prevents cascading renders)
      setScrolled((prev) => (prev !== isOverThreshold ? isOverThreshold : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CustomerHeader
      initialCategories={initialCategories}
      initialBrands={initialBrands}
      scrolled={scrolled}
    >
      {children}
    </CustomerHeader>
  );
}
