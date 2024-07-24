#!/usr/bin/env python3
"""This module implements a caching system"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """This implements a LIFOCache class"""

    def __init__(self):
        super().__init__()

    def put(self, key, item):
        """Add an item in the cache"""
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                # LIFO logic: remove the most recently added item
                last_key = next(reversed(self.cache_data))
                del self.cache_data[last_key]
                print("DISCARD: {}".format(last_key))
            self.cache_data[key] = item

    def get(self, key):
        """Get an item by key"""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key)
