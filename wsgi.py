import os
import subprocess
import sys

os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
sys.path.insert(0, os.path.dirname(__file__))

subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], check=True)

from app.main import app  # noqa: E402

application = app
