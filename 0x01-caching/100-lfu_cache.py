#!/usr/bin/env python3
"""This module implements a caching system"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """This implements a LFUCache class"""

    def __init__(self):
        super().__init__()
        self.frequency = {}
        self.usage_order = {}

    def put(self, key, item):
        """Add an item in the cache"""
        if key is not None and item is not None:
            if key in self.cache_data:
                # If key already in cache, just update the item and frequency
                self.cache_data[key] = item
                self.frequency[key] += 1
            else:
                # Check if we need to evict an item
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    # Find the least frequently used item
                    min_freq = min(self.frequency.values())
                    keys_with_min_freq = [k for k, v in self.frequency.items()
                                          if v == min_freq]
                    # If multiple items have the same frequency
                    # evict the oldest one
                    if len(keys_with_min_freq) > 1:
                        key_to_evict = sorted(keys_with_min_freq, key=lambda k:
                                              self.usage_order[k])[0]
                    else:
                        key_to_evict = keys_with_min_freq[0]
                    del self.cache_data[key_to_evict]
                    del self.frequency[key_to_evict]
                    del self.usage_order[key_to_evict]
                    print("DISCARD: {}".format(key_to_evict))
                # Add new item
                self.cache_data[key] = item
                self.frequency[key] = 1
            # Update usage order
            self.usage_order[key] = len(self.usage_order)

    def get(self, key):
        """Get an item by key"""
        if key is None or key not in self.cache_data:
            return None
        # Update the frequency and usage order
        self.frequency[key] += 1
        self.usage_order[key] = len(self.usage_order)
        return self.cache_data[key]
