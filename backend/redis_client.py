import redis
import json
import asyncio
import os
from functools import wraps

# 🛠️ UPDATED: Use the REDIS_URL from Render environment variables
# Fallback to localhost only if the variable is missing
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

# Create the client using from_url to handle the full connection string
# decode_responses=True ensures we get strings back instead of bytes
r = redis.from_url(redis_url, decode_responses=True)

def cache_sky_data(ttl_seconds=60):
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            lat = kwargs.get('lat', 35.92)
            lon = kwargs.get('lon', -86.86)
            cache_key = f"{func.__name__}:{round(lat, 1)}:{round(lon, 1)}"
            
            try:
                cached_val = r.get(cache_key)
                if cached_val:
                    return json.loads(cached_val)
            except Exception as e:
                print(f"⚠️ Redis Cache Read Error: {e}")

            result = await func(*args, **kwargs)
            
            try:
                r.setex(cache_key, ttl_seconds, json.dumps(result))
            except Exception as e:
                print(f"⚠️ Redis Cache Write Error: {e}")
                
            return result

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            lat = kwargs.get('lat', 35.92)
            lon = kwargs.get('lon', -86.86)
            cache_key = f"{func.__name__}:{round(lat, 1)}:{round(lon, 1)}"
            
            try:
                cached_val = r.get(cache_key)
                if cached_val:
                    return json.loads(cached_val)
            except Exception as e:
                print(f"⚠️ Redis Cache Read Error: {e}")

            result = func(*args, **kwargs)
            
            try:
                r.setex(cache_key, ttl_seconds, json.dumps(result))
            except Exception as e:
                print(f"⚠️ Redis Cache Write Error: {e}")
                
            return result

        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator

# 🔍 Test connection on startup
try:
    r.ping()
    print("✅ Redis Connection Status: Connected to Upstash!")
except Exception as e:
    print(f"❌ Redis Connection Status: Failed! Error: {e}")