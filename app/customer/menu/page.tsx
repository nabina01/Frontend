"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

import { Search, ShoppingCart, Loader2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useCart } from "@/src/context/cart-context";
import { MenuSearchTrie } from "@/src/lib/trie-search";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image?: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const { addItem } = useCart();
  
  // Initialize Trie only once
  const searchTrie = useMemo(() => new MenuSearchTrie(), []);

  useEffect(() => {
    const menuData: MenuCategory[] = [
      {
        category: "Coffee",
        items: [
          {
            id: 1,
            name: "Americano",
            price: 120,
            available: true,
            image: "/Americano.jpeg",
          },
          {
            id: 2,
            name: "Cappuccino",
            price: 150,
            available: true,
            image: "/Cappuccino.jpeg",
          },
          {
            id: 3,
            name: "Latte",
            price: 160,
            available: true,
            image: "/latte.jpeg",
          },
          {
            id: 4,
            name: "Espresso",
            price: 100,
            available: true,
            image: "/espresso-coffee.jpeg",
          },
          {
            id: 5,
            name: "Macchiato",
            price: 140,
            available: true,
            image: "/Macchiato.jpeg",
          },
          {
            id: 6,
            name: "Iced Coffee",
            price: 170,
            available: true,
            image: "/IcedCoffee.jpeg",
          },
        ],
      },
      {
        category: "Tea",
        items: [
          {
            id: 7,
            name: "Black Tea",
            price: 80,
            available: true,
            image: "/BlackTea.jpeg",
          },
          {
            id: 8,
            name: "Green Tea",
            price: 100,
            available: true,
            image: "/GreenTea.jpeg",
          },
          {
            id: 9,
            name: "Milk Tea",
            price: 120,
            available: true,
            image: "/MilkTea.jpeg",
          },
          {
            id: 10,
            name: "Matka Chai",
            price: 90,
            available: true,
            image: "/MatkaChai.jpeg",
          },
          {
            id: 11,
            name: "Iced Lemon Tea",
            price: 130,
            available: true,
            image: "/IcedLemonTea.jpeg",
          },
        ],
      },
      {
        category: "Milkshakes & Lassi",
        items: [
          {
            id: 12,
            name: "Chocolate Milkshake",
            price: 200,
            available: true,
            image: "/ChocolateMilkshake.jpeg",
          },
          {
            id: 13,
            name: "Strawberry Milkshake",
            price: 200,
            available: true,
            image: "/StrawberryMilkshake.jpeg",
          },
          {
            id: 14,
            name: "Vanilla Milkshake",
            price: 180,
            available: true,
            image: "/VanillaMilkshake.jpeg",
          },
          {
            id: 15,
            name: "Mango Lassi",
            price: 160,
            available: true,
            image: "/MangoLassi.jpeg",
          },
          {
            id: 16,
            name: "Sweet Lassi",
            price: 140,
            available: true,
            image: "/SweetLassi.jpeg",
          },
        ],
      },
      {
        category: "Fresh Juices & Coolers",
        items: [
          {
            id: 17,
            name: "Lemonade",
            price: 100,
            available: true,
            image: "/Lemonade.jpeg",
          },
          {
            id: 18,
            name: "Orange Pineapple Juice",
            price: 150,
            available: true,
            image: "/OrangePineapple.jpeg",
          },
          {
            id: 19,
            name: "Mango Smoothie",
            price: 180,
            available: true,
            image: "/MangoSmoothie.jpeg",
          },
          {
            id: 20,
            name: "Strawberry Lemon Cooler",
            price: 160,
            available: true,
            image: "/StrawberryLemonCooler.jpeg",
          },
        ],
      },
      {
        category: "Bakery & Desserts",
        items: [
          {
            id: 21,
            name: "Croissant",
            price: 120,
            available: true,
            image: "/Croissant.jpeg",
          },
          {
            id: 22,
            name: "Muffin",
            price: 130,
            available: true,
            image: "/Muffin.jpeg",
          },
          {
            id: 23,
            name: "Brownie",
            price: 150,
            available: true,
            image: "/Brownie.jpeg",
          },
          {
            id: 24,
            name: "Donut",
            price: 100,
            available: true,
            image: "/Donut.jpeg",
          },
          {
            id: 25,
            name: "Cookie",
            price: 90,
            available: true,
            image: "/Cookie.jpeg",
          },
        ],
      },
      {
        category: "Soft Drinks",
        items: [
          {
            id: 26,
            name: "Coke",
            price: 80,
            available: true,
            image: "/Coke.jpeg",
          },
          {
            id: 27,
            name: "Sprite",
            price: 80,
            available: true,
            image: "/Sprite.jpeg",
          },
          {
            id: 28,
            name: "Fanta",
            price: 80,
            available: true,
            image: "/Fanta.jpeg",
          },
          {
            id: 29,
            name: "Pepsi",
            price: 80,
            available: true,
            image: "/Pepsi.jpeg",
          },
          {
            id: 30,
            name: "Dew",
            price: 80,
            available: true,
            image: "/Dew.jpeg",
          },
        ],
      },
    ];

    setMenu(menuData);
    setLoading(false);
    
    // Build Trie index with all menu items
    menuData.forEach(category => {
      category.items.forEach(item => {
        searchTrie.insert(item)
      })
    })
  }, [searchTrie]);

  const addToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
  };

  // Handle search with Trie algorithm
  const handleSearch = (query: string) => {
    setSearchTerm(query)
    
    if (query.trim().length >= 2) {
      // Use Trie search - O(m) complexity
      const results = searchTrie.search(query)
      setSearchResults(results)
      
      // Get autocomplete suggestions
      const autoSuggestions = searchTrie.getSuggestions(query, 5)
      setSuggestions(autoSuggestions)
      setShowSuggestions(true)
    } else {
      setSearchResults([])
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    const results = searchTrie.search(suggestion)
    setSearchResults(results)
    setShowSuggestions(false)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setSuggestions([])
    setShowSuggestions(false)
  }

  // Get filtered items for display
  const getFilteredItems = (items: MenuItem[]) => {
    if (searchTerm.trim().length >= 2 && searchResults.length > 0) {
      // Show only items from Trie search results
      return items.filter(item => 
        searchResults.some(result => result.id === item.id)
      )
    }
    return items
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
      <p className="text-muted-foreground mb-8">Browse our delicious items</p>

      {/* Search */}
      <div className="relative mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search menu items... (try 'cof', 'tea', 'choc')"
          className="pl-10 pr-10"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (searchTerm.length >= 2) {
              setShowSuggestions(true)
            }
          }}
        />
        
        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Autocomplete suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-2 py-1 font-medium">
                Suggestions ({suggestions.length})
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Search results count */}
        {searchTerm.length >= 2 && (
          <div className="mt-2 text-sm text-muted-foreground">
            {searchResults.length > 0 
              ? `Found ${searchResults.length} item${searchResults.length !== 1 ? 's' : ''}`
              : 'No items found'}
          </div>
        )}
      </div>

      {/* Categories */}
      {menu.map((section) => {
        const filteredItems = getFilteredItems(section.items)
        
        // Hide category if no items match search
        if (filteredItems.length === 0) return null
        
        return (
          <div key={section.category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {section.category}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredItems.length} items)
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
  <Image
    src={item.image || "/placeholder.svg"}
    alt={item.name}
    fill
    className="object-contain"
  />
</div>


                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      Rs.{item.price}
                    </span>
                    <Button
                      size="sm"
                      disabled={!item.available}
                      onClick={() => addToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  );
}
