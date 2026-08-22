import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure root directory is on sys.path
root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.main import app

@pytest.fixture
def client():
    """Pytest fixture providing a FastAPI TestClient."""
    with TestClient(app) as test_client:
        yield test_client
