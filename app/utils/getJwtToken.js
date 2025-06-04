export const getJwtToken = async (user) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/realdocs/jwt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (data?.token) {
      localStorage.setItem('access-token', data.token);
    }
  } catch (error) {
    console.error("JWT fetch error:", error);
  }
};
