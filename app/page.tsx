"use client";

import { Button } from "@/src/components/ui/button";
import { Coffee, Cake } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#b49977ff" }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 backdrop-blur border-b border-border"
        style={{ backgroundColor: "#5d5042ff" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Aromalaya</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#story"
              className="text-foreground/120 hover:text-foreground transition"
            >
              All About Us
            </a>
            <a
              href="#services"
              className="text-foreground/120 hover:text-foreground transition"
            >
              Our Services
            </a>

            <a
              href="#menu"
              className="text-foreground/120 hover:text-foreground transition"
            >
              Menu
            </a>
            <a
              href="#menu"
              className="text-foreground/100 hover:text-foreground transition"
              onClick={() => router.push("/login")}
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-b from-secondary to-background px-4 md:px-6 py-24 md:py-32"
        style={{ backgroundColor: "#8B5E3C" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 md:space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif text-foreground leading-tight text-balance">
              Authentic Nepali Flavors & Cozy Cafe Vibes
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto text-balance">
              Experience a warm, inviting space where authentic Nepali cuisine
              meets artisan coffee culture
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        id="story"
        className="px-4 md:px-6 py-20 md:py-28"
        style={{ backgroundColor: "#614f43ff" }}
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                  All About Us
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full"></div>
              </div>

              <p className="text-lg text-foreground/70 leading-relaxed">
                Aromalaya started with a vision to bring authentic Nepali
                flavors and cozy cafe vibes together. Our mission is to create a
                warm, inviting space for everyone who loves great coffee and
                freshly baked treats. We believe that every cup of coffee and
                every pastry tells a story of dedication, passion, and cultural
                heritage.
              </p>

              <div
                className="rounded-xl p-8 border border-primary/20"
                style={{ backgroundColor: "#8b6c5c" }}
              >
                <p className="text-lg text-foreground/90 leading-relaxed">
                  "We believe that great coffee and fresh pastries are made with
                  heart, and that's exactly what we bring to our craft every
                  single day."
                </p>
              </div>
            </div>

            {/* Right: Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/cafe.jpeg"
                alt="Aromalaya Cafe Interior"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Mission, Vision & Values */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div 
              className="rounded-2xl p-8 border border-primary/30 shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: "#8b6c5c" }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Coffee className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    Bring joy and flavor to every cup and every bite.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div 
              className="rounded-2xl p-8 border border-primary/30 shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: "#8b6c5c" }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Cake className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    Be the most loved cafe, where every visit feels special.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values - Full Width */}
          <div 
            className="rounded-2xl p-10 border border-primary/30 shadow-lg"
            style={{ backgroundColor: "#8b6c5c" }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Quality */}
              <div className="text-center space-y-3">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Coffee className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-foreground">Quality</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Fresh, delicious, and crafted with care.
                </p>
              </div>

              {/* Happiness */}
              <div className="text-center space-y-3">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">😊</span>
                </div>
                <h4 className="text-xl font-bold text-foreground">Happiness</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Guests first, always.
                </p>
              </div>

              {/* Warmth */}
              <div className="text-center space-y-3">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🤝</span>
                </div>
                <h4 className="text-xl font-bold text-foreground">Warmth</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  A cozy place to relax and connect.
                </p>
              </div>

              {/* Sustainability */}
              <div className="text-center space-y-3">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🌱</span>
                </div>
                <h4 className="text-xl font-bold text-foreground">Sustainability</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Caring for people and the planet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics / Results Section */}
      <section
        className="px-4 md:px-6 py-20 md:py-28 bg-background/5"
        style={{ backgroundColor: "#614f43ff" }}
      >
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            About Aromalaya Cafe Management System
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* 10M Reservations */}
            <div className="bg-background border border-border rounded-xl p-8 shadow hover:shadow-lg transition space-y-3">
              <div className="text-3xl font-bold text-foreground">10000+</div>
              <div className="text-lg font-semibold text-foreground/90">
                Reservations
              </div>
              <div className="text-sm text-foreground/70">processed</div>
            </div>

            {/* 25% Reduction */}
            <div className="bg-background border border-border rounded-xl p-8 shadow hover:shadow-lg transition space-y-3">
              <div className="text-3xl font-bold text-foreground">25%</div>
              <div className="text-lg font-semibold text-foreground/90">
                Reduction
              </div>
              <div className="text-sm text-foreground/70">in no-shows</div>
            </div>

            {/* 500K Staff hours */}
            <div className="bg-background border border-border rounded-xl p-8 shadow hover:shadow-lg transition space-y-3">
              <div className="text-3xl font-bold text-foreground">500K</div>
              <div className="text-lg font-semibold text-foreground/90">
                Staff hours
              </div>
              <div className="text-sm text-foreground/70">saved</div>
            </div>

            {/* 300% Increased feedback */}
            <div className="bg-background border border-border rounded-xl p-8 shadow hover:shadow-lg transition space-y-3">
              <div className="text-3xl font-bold text-foreground">300%</div>
              <div className="text-lg font-semibold text-foreground/90">
                Customer Satisfaction
              </div>
              <div className="text-sm text-foreground/70">
                Increase in Guest Happiness
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="px-4 md:px-6 py-20 md:py-28"
        style={{ backgroundColor: "#614f43ff" }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2
            className="text-4xl md:text-5xl font-serif"
            style={{ color: "#F5EDE3" }}
          >
            Ready to Experience Aromalaya?
          </h2>

          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#E8DFD1" }}>
            Join us for an authentic Nepali cafe experience filled with warmth,
            great coffee, and delicious treats.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
        </div>
      </section>
      {/* Services Section */}
      <section
        id="services"
        className="px-4 md:px-6 py-20 md:py-28"
        style={{ backgroundColor: "#6a4a3a" }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">
              Our Services
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              At Aromalaya, we go beyond great taste — we focus on creating a
              relaxing, welcoming environment and convenient services for every
              guest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background border border-border rounded-xl p-8 space-y-3 hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground">
                Dine-in Experience
              </h3>
              <p className="text-foreground/70">
                Enjoy a cozy and relaxing atmosphere — perfect for friends,
                work, or study.
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-8 space-y-3 hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground">
                Pre-Order & Pick-Up
              </h3>
              <p className="text-foreground/70">
                Place your order ahead of time and simply collect it when you
                arrive — quick, easy, and hassle-free.
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-8 space-y-3 hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground">
                Catering Services
              </h3>
              <p className="text-foreground/70">
                We cater events, corporate meetings, birthdays, and special
                occasions.
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-8 space-y-3 hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground">
                Events & Private Bookings
              </h3>
              <p className="text-foreground/70">
                Host gatherings, meet-ups, workshops, or celebrations at
                Aromalaya.
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-8 space-y-3 hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground">
                Free Wi-Fi & Work-Friendly Space
              </h3>
              <p className="text-foreground/70">
                A peaceful café environment designed for remote work and study.
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-8 space-y-3 hover:border-primary/30 transition">
              <h3 className="text-xl font-semibold text-foreground">
                Specialty Coffee & Custom Drinks
              </h3>
              <p className="text-foreground/70">
                Personalized drinks crafted by skilled baristas — just the way
                you like it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section
        id="menu"
        className="px-4 md:px-6 py-20 md:py-28 bg-secondary/30"
        style={{ backgroundColor: "#6759472e" }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Title */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">
              Our Menu
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Coffee Section */}
            <div className="bg-background rounded-xl p-8 border border-border hover:border-primary/30 transition space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Coffees</h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                From espresso to specialty brews, our baristas craft every cup
                with care using premium, ethically-sourced beans.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>• Americano </li>
                <li>• Espresso </li>
                <li>• Iced Coffee </li>
                <li>• Latte </li>
                <li>• Cappuccino </li>
                <li>• Macchiato </li>
              </ul>
            </div>

            {/* Tea Section */}
            <div className="bg-background rounded-xl p-8 border border-border hover:border-primary/30 transition space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Teas</h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Curated selection of teas from Nepal's finest tea gardens and
                worldwide sources.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>• Black Tea </li>
                <li>• Green Tea </li>
                <li>• Milk Tea </li>
                <li>• Matka Chai </li>
                <li>• Iced Lemon Tea </li>
              </ul>
            </div>

            {/* Milkshakes & Lassi Section */}
            <div className="bg-background rounded-xl p-8 border border-border hover:border-primary/30 transition space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Milkshakes & Lassi
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Delicious milkshakes and traditional lassis made fresh to quench
                your thirst.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>• Chocolate Milkshake </li>
                <li>• Strawberry Milkshake </li>
                <li>• Vanilla Milkshake </li>
                <li>• Mango Lassi </li>
                <li>• Sweet Lassi </li>
              </ul>
            </div>

            {/* Fresh Juices & Coolers Section */}
            <div className="bg-background rounded-xl p-8 border border-border hover:border-primary/30 transition space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Fresh Juices & Coolers
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Refreshing and natural juices made from the freshest fruits.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>• Lemonade </li>
                <li>• Orange Pineapple Juice </li>
                <li>• Mango Smoothie </li>
                <li>• Strawberry Lemon Cooler </li>
              </ul>
            </div>

            {/* Bakery & Desserts Section */}
            <div className="bg-background rounded-xl p-8 border border-border hover:border-primary/30 transition space-y-4">
              <div className="flex items-center gap-3">
                <Cake className="w-8 h-8 text-accent" />
                <h3 className="text-2xl font-bold text-foreground">
                  Bakery & Desserts
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Freshly baked pastries, cookies, and desserts made every
                morning.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>• Croissant </li>
                <li>• Muffin </li>
                <li>• Brownie </li>
                <li>• Donut </li>
                <li>• Cookie </li>
              </ul>
            </div>

            {/* Soft Drinks Section */}
            <div className="bg-background rounded-xl p-8 border border-border hover:border-primary/30 transition space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Soft Drinks
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Classic soft drinks to refresh your day.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>• Coke </li>
                <li>• Sprite </li>
                <li>• Fanta  </li>
                <li>• Pepsi </li>
                <li>• Dew </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-foreground/95 text-background px-4 md:px-6 py-12"
        style={{ backgroundColor: "#453225ff" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Coffee className="w-6 h-6" />
                Aromalaya
              </h4>
              <p className="text-background/70 text-sm leading-relaxed">
                Authentic Nepali flavors and cozy cafe vibes in one warm space.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#menu" className="hover:text-background transition">
                    Coffee
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-background transition">
                    Baked Goods
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-background transition">
                    Teas
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-background transition">
                    Fresh Juices & Coolers
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-background transition">
                    Milkshakes & Lassi
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-background transition">
                    Soft Drinks
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#" className="hover:text-background transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition">
                    Facebook
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-background transition">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
            <p>
              {" "}
              &copy; 2026 Aromalaya Cafe. All rights reserved. Made with Love in
              Nepal.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
