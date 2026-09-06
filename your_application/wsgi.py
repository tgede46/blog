import os
import sys

os.chdir(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

if os.environ.get("DATABASE_URL"):
    os.system(f"{sys.executable} -m alembic upgrade head")

port = os.environ.get("PORT", "10000")
os.execv(sys.executable, [
    sys.executable, "-m", "uvicorn", "app.main:app",
    "--host", "0.0.0.0", "--port", port,
    "--proxy-headers", "--forwarded-allow-ips", "*",
])
