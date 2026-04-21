"use client";

import { useState, useEffect, useRef } from "react";
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
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScrolledState = () => {
      const isOverThreshold = window.scrollY > 10;
      // Only update if value actually changed (prevents cascading renders)
      setScrolled((prev) => (prev !== isOverThreshold ? isOverThreshold : prev));
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateScrolledState();
      });
    };

    updateScrolledState();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
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
