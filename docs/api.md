# GlobeTrotter API Documentation Reference

All REST API endpoints are prefixed with `/api/v1`.

## Modules

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Register new user account.
- `POST /api/v1/auth/login`: Authenticate and return JWT access token.
- `GET /api/v1/auth/me`: Return authenticated user profile.

### Users (`/api/v1/users`)
- `GET /api/v1/users/me`: Fetch current user details and preferences.
- `PUT /api/v1/users/me`: Update profile details.
- `POST /api/v1/users/me/change-password`: Update password.
- `GET /api/v1/users/me/preferences`: Fetch preferences.
- `PUT /api/v1/users/me/preferences`: Update preferences.
- `POST /api/v1/users/me/deactivate`: Deactivate user account.

### Trips (`/api/v1/trips`)
- `GET /api/v1/trips`: List trips owned by current user.
- `POST /api/v1/trips`: Create a new trip.
- `GET /api/v1/trips/{trip_id}`: Fetch trip detail.
- `PUT /api/v1/trips/{trip_id}`: Update trip properties.
- `DELETE /api/v1/trips/{trip_id}`: Delete trip.
- `GET /api/v1/trips/{trip_id}/budget`: Get aggregated budget summary.

### Destination Stops (`/api/v1/trip-stops`)
- `POST /api/v1/trip-stops`: Add stop to a trip.
- `GET /api/v1/trips/{trip_id}/stops`: List stops for a trip.
- `PUT /api/v1/trip-stops/{stop_id}`: Update stop dates/notes.
- `DELETE /api/v1/trip-stops/{stop_id}`: Remove stop.
- `POST /api/v1/trips/{trip_id}/stops/reorder`: Reorder stops.

### Itinerary Items (`/api/v1/itinerary`)
- `POST /api/v1/itinerary`: Add activity to a stop itinerary.
- `GET /api/v1/trip-stops/{stop_id}/itinerary`: List itinerary items for a stop.
- `PUT /api/v1/itinerary/{item_id}`: Update itinerary item schedule/time.
- `DELETE /api/v1/itinerary/{item_id}`: Remove itinerary item.

### Expenses (`/api/v1/expenses`)
- `GET /api/v1/expenses?trip_id={id}`: List expenses for a trip.
- `POST /api/v1/expenses`: Create new expense.
- `PUT /api/v1/expenses/{expense_id}`: Update expense.
- `DELETE /api/v1/expenses/{expense_id}`: Remove expense.

### Admin & Moderation (`/api/v1/admin`)
- `GET /api/v1/admin/stats`: Get system analytics (total users, active users, total trips).
- `GET /api/v1/admin/users`: List users for admin management.
- `POST /api/v1/admin/users/{user_id}/deactivate`: Deactivate user account (Admin only).
- `POST /api/v1/admin/users/{user_id}/reactivate`: Reactivate user account (Admin only).
