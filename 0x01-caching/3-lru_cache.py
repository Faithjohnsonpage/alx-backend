#!/usr/bin/env python3
"""This module implements a caching system"""
from base_caching import BaseCaching
from collections import OrderedDict


class LRUCache(BaseCaching):
    """This implements a LRUCache class"""

    def __init__(self):
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Add an item in the cache"""
        if key is not None and item is not None:
            if key in self.cache_data:
                # Remove the old value to update it later
                self.cache_data.pop(key)
            elif len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                # LRU logic: remove the least recently used item
                discarded = next(iter(self.cache_data))
                self.cache_data.pop(discarded)
                print("DISCARD: {}".format(discarded))
            # Insert the item as the most recently used
            self.cache_data[key] = item
            self.cache_data.move_to_end(key)

    def get(self, key):
        """Get an item by key"""
        if key is None or key not in self.cache_data:
            return None
        # Move the accessed key to the end to mark it as recently used
        self.cache_data.move_to_end(key)
        return self.cache_data[key]
