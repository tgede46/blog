import logging
import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse, Response

from app.config import settings

logger = logging.getLogger("app.requests")


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: object) -> None:
        super().__init__(app)
        self.requests: dict[str, deque[float]] = defaultdict(deque)
        self.lock = Lock()

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if not request.url.path.startswith("/api/"):
            return await call_next(request)

        client_ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        if not client_ip:
            client_ip = request.client.host if request.client else "unknown"
        sensitive_path = request.url.path in {
            "/api/auth/login",
            "/api/auth/mfa/verify",
            "/api/auth/mfa/email/send",
            "/api/auth/mfa/email/setup",
            "/api/auth/mfa/email/confirm",
            "/api/auth/mfa/totp/setup",
            "/api/auth/mfa/totp/confirm",
            "/api/auth/password",
            "/api/contact",
            "/api/newsletter/subscribe",
        }
        bucket = request.url.path if sensitive_path else "general"
        key = f"{client_ip}:{bucket}"
        now = time.monotonic()
        window = settings.rate_limit_window_seconds
        limit = settings.rate_limit_requests
        if sensitive_path:
            limit = min(limit, 10)

        with self.lock:
            entries = self.requests[key]
            while entries and entries[0] <= now - window:
                entries.popleft()
            if len(entries) >= limit:
                retry_after = max(1, int(window - (now - entries[0])))
                return JSONResponse(
                    {"detail": "Too many requests"},
                    status_code=429,
                    headers={"Retry-After": str(retry_after)},
                )
            entries.append(now)

        started = time.perf_counter()
        response = await call_next(request)
        logger.info(
            "request_completed",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration_ms": round((time.perf_counter() - started) * 1000, 2),
            },
        )
        return response
