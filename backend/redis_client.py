import redis
import json
from functools import wraps
from fastapi import Response

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def cache_sky_data(ttl_seconds=60):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 1. Identify if a Response object was passed (FastAPI does this automatically)
            # Or we can just create a header if we return a dict
            lat = kwargs.get('lat', 35.92)
            lon = kwargs.get('lon', -86.86)
            cache_key = f"{func.__name__}:{round(lat, 1)}:{round(lon, 1)}"
            
            try:
                cached_val = r.get(cache_key)
                if cached_val:
                    # In a real FastAPI route, we'd need access to the response object 
                    # to set headers. For now, let's keep it simple:
                    return json.loads(cached_val)
            except redis.ConnectionError:
                pass

            result = func(*args, **kwargs)

            try:
                r.setex(cache_key, ttl_seconds, json.dumps(result))
            except redis.ConnectionError:
                pass
            
            return result
        return wrapper
    return decorator