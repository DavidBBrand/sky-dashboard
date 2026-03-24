import pytest
from httpx import AsyncClient
from main import app  # Import your FastAPI instance

@pytest.mark.asyncio
async def test_sky_summary_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Testing your Franklin, TN coordinates
        response = await ac.get("/sky-summary?lat=35.92&lon=-86.86")
    
    assert response.status_code == 200
    data = response.json()
    assert "sun" in data
    assert "planets" in data
    # Verify your decimal rounding logic
    assert isinstance(data["planets"][0]["distance_au"], float)

@pytest.mark.asyncio
async def test_invalid_coordinates():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Testing missing parameters
        response = await ac.get("/sky-summary")
    assert response.status_code == 422 # FastAPI validation error