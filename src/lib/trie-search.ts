/**
 * Trie Node for efficient prefix-based search
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map()
  isEndOfWord: boolean = false
  menuItems: any[] = []
}

/**
 * MenuSearchTrie - Efficient search algorithm for menu items
 * Time Complexity: O(m) where m is the length of search query
 * Space Complexity: O(n*m) where n is number of items, m is average word length
 */
export class MenuSearchTrie {
  private root: TrieNode = new TrieNode()

  /**
   * Insert a menu item into the Trie
   * @param item - Menu item to insert
   */
  insert(item: any): void {
    const words = item.name.toLowerCase().split(' ')
    
    // Insert each word from the item name
    words.forEach(word => {
      let node = this.root
      
      // Build tree character by character
      for (const char of word) {
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode())
        }
        node = node.children.get(char)!
        
        // Store item reference at each level for prefix matching
        if (!node.menuItems.find(i => i.id === item.id)) {
          node.menuItems.push(item)
        }
      }
      
      node.isEndOfWord = true
    })
  }

  /**
   * Search for menu items matching the prefix
   * @param prefix - Search query
   * @returns Array of matching menu items
   */
  search(prefix: string): any[] {
    if (!prefix || prefix.trim() === '') {
      return []
    }

    prefix = prefix.toLowerCase().trim()
    let node = this.root

    // Traverse to the end of prefix
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [] // No matches found
      }
      node = node.children.get(char)!
    }

    // Return unique items (use Set to avoid duplicates)
    const uniqueItems = Array.from(
      new Map(node.menuItems.map(item => [item.id, item])).values()
    )

    return uniqueItems
  }

  /**
   * Get autocomplete suggestions based on prefix
   * @param prefix - Search query
   * @param limit - Maximum number of suggestions (default: 5)
   * @returns Array of suggested item names
   */
  getSuggestions(prefix: string, limit: number = 5): string[] {
    const items = this.search(prefix)
    
    return items
      .slice(0, limit)
      .map(item => item.name)
  }

  /**
   * Clear all data from the Trie
   */
  clear(): void {
    this.root = new TrieNode()
  }

  /**
   * Get total number of items in the Trie
   */
  getSize(): number {
    const allItems = new Set()
    this.collectAllItems(this.root, allItems)
    return allItems.size
  }

  private collectAllItems(node: TrieNode, itemSet: Set<any>): void {
    node.menuItems.forEach(item => itemSet.add(item))
    node.children.forEach(child => this.collectAllItems(child, itemSet))
  }
}

export default MenuSearchTrie
