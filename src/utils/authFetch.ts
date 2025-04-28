export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("accessToken");

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Content-Type", "application/json");

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let res = await fetch(url, fetchOptions);

  if (res.status === 401 || res.status === 403) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = localStorage.getItem("accessToken");
      headers.set("Authorization", `Bearer ${newToken}`);

      res = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    }
  }

  return res;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.REACT_APP_DOMAIN_NAME}api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data.accessToken) return false;

    localStorage.setItem("accessToken", data.accessToken);
    return true;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    return false;
  }
}
