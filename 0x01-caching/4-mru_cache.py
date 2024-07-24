#!/usr/bin/env python3
"""This module implements a caching system"""
from base_caching import BaseCaching
from collections import OrderedDict


class MRUCache(BaseCaching):
    """This implements a MRUCache class"""

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
                # MRU logic: remove the most recently used item
                discarded, _ = self.cache_data.popitem(last=True)
                print("DISCARD: {}".format(discarded))
            self.cache_data[key] = item

    def get(self, key):
        """Get an item by key"""
        if key is None or key not in self.cache_data:
            return None
        # Move the accessed key to the end to mark it as recently used
        self.cache_data.move_to_end(key)
        return self.cache_data[key]
