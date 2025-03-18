import os
import requests
import logging
import json
import time
from typing import Dict, Any, Tuple

logger = logging.getLogger("api-client")

class APIClient:
    def __init__(self):
        # Get base URL from env vars or use localhost
        self.base_url = os.environ.get('API_BASE_URL', 'http://localhost:3000/api')
        self.cache = {}
        self.cache_timestamp = {}
        self.cache_ttl = 300  # 5 minutes

    def _is_cache_valid(self, key: str) -> bool:
        """Check if cached data is still valid"""
        if key not in self.cache or key not in self.cache_timestamp:
            return False
        
        # Check if cache has expired
        now = time.time()
        return (now - self.cache_timestamp[key]) < self.cache_ttl

    def get_suspects(self) -> Dict[str, Any]:
        """Fetch all suspects from the API"""
        # Return from cache if valid
        if self._is_cache_valid('suspects'):
            logger.info("Using cached suspect data")
            return self.cache['suspects']
            
        try:
            logger.info(f"Fetching suspects from {self.base_url}/suspects")
            response = requests.get(f"{self.base_url}/suspects")
            response.raise_for_status()
            data = response.json()
            
            # Update cache
            self.cache['suspects'] = data
            self.cache_timestamp['suspects'] = time.time()
            
            logger.info(f"Successfully fetched {len(data)} suspects")
            return data
        except Exception as e:
            logger.error(f"Error fetching suspects: {e}")
            # Return cached data if available even if expired
            if 'suspects' in self.cache:
                logger.info("Using expired cached suspect data due to error")
                return self.cache['suspects']
            # Otherwise return empty dict
            return {}

    def get_story_context(self) -> Dict[str, Any]:
        """Fetch story context from the API"""
        # Return from cache if valid
        if self._is_cache_valid('story'):
            logger.info("Using cached story data")
            return self.cache['story']
            
        try:
            logger.info(f"Fetching story context from {self.base_url}/story")
            response = requests.get(f"{self.base_url}/story")
            response.raise_for_status()
            data = response.json()
            
            # Update cache
            self.cache['story'] = data
            self.cache_timestamp['story'] = time.time()
            
            logger.info("Successfully fetched story context")
            return data
        except Exception as e:
            logger.error(f"Error fetching story context: {e}")
            # Return cached data if available even if expired
            if 'story' in self.cache:
                logger.info("Using expired cached story data due to error")
                return self.cache['story']
            # Otherwise return empty dict
            return {}

    def get_suspect_and_story(self) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """Fetch both suspects and story data"""
        suspects = self.get_suspects()
        story = self.get_story_context()
        return suspects, story 