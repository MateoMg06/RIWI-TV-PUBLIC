import Country from './country.model';
import Department from './department.model';
import City from './city.model';
import Cinema from './cinema.model';
import Movie from './movie.model';
import Showtime from './showtime.model';
import User from './user.model';
import Profile from './profile.model';
import Membership from './membership.model';
import PurchaseHistory from './purchase-history.model';
import RefreshToken from './refresh-token.model';
import AccessAudit from './access-audit.model';
import PasswordResetToken from './password-reset-token.model';
import ReleaseNotification from './release-notification.model';
import Seat from './seat.model';
import SeatLock from './seat-lock.model';

Country.hasMany(Department, { as: 'departments', foreignKey: 'countryId' });
Department.belongsTo(Country, { as: 'country', foreignKey: 'countryId' });
Department.hasMany(City, { as: 'cities', foreignKey: 'departmentId' });
City.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });
City.hasMany(Cinema, { as: 'cinemas', foreignKey: 'cityId' });
Cinema.belongsTo(City, { as: 'city', foreignKey: 'cityId' });

Cinema.hasMany(Showtime, { as: 'showtimes', foreignKey: 'cinemaId' });
Movie.hasMany(Showtime, { as: 'showtimes', foreignKey: 'movieId' });
Showtime.belongsTo(Cinema, { as: 'cinema', foreignKey: 'cinemaId' });
Showtime.belongsTo(Movie, { as: 'movie', foreignKey: 'movieId' });
Cinema.belongsToMany(Movie, {
  through: Showtime,
  as: 'movies',
  foreignKey: 'cinemaId',
  otherKey: 'movieId',
});
Movie.belongsToMany(Cinema, {
  through: Showtime,
  as: 'cinemas',
  foreignKey: 'movieId',
  otherKey: 'cinemaId',
});

User.belongsTo(City, { as: 'selectedCity', foreignKey: 'cityId' });
City.hasMany(User, { as: 'users', foreignKey: 'cityId' });
User.hasOne(Profile, { as: 'profile', foreignKey: 'userId' });
Profile.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasOne(Membership, { as: 'userMembership', foreignKey: 'userId' });
Membership.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(PurchaseHistory, { as: 'purchaseHistories', foreignKey: 'userId' });
PurchaseHistory.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Membership.hasMany(PurchaseHistory, { as: 'purchases', foreignKey: 'membershipId' });
PurchaseHistory.belongsTo(Membership, { as: 'membership', foreignKey: 'membershipId' });
User.hasMany(RefreshToken, { as: 'refreshTokens', foreignKey: 'userId' });
RefreshToken.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(AccessAudit, { as: 'accessAudits', foreignKey: 'userId' });
AccessAudit.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(PasswordResetToken, { as: 'passwordResetTokens', foreignKey: 'userId' });
PasswordResetToken.belongsTo(User, { as: 'user', foreignKey: 'userId' });

User.hasMany(ReleaseNotification, { as: 'releaseNotifications', foreignKey: 'userId' });
Movie.hasMany(ReleaseNotification, { as: 'releaseNotifications', foreignKey: 'movieId' });
ReleaseNotification.belongsTo(User, { as: 'user', foreignKey: 'userId' });
ReleaseNotification.belongsTo(Movie, { as: 'movie', foreignKey: 'movieId' });
ReleaseNotification.belongsTo(City, { as: 'city', foreignKey: 'cityId' });

Showtime.hasMany(Seat, { as: 'seats', foreignKey: 'showtimeId' });
Seat.belongsTo(Showtime, { as: 'showtime', foreignKey: 'showtimeId' });
User.hasMany(SeatLock, { as: 'seatLocks', foreignKey: 'userId' });
Showtime.hasMany(SeatLock, { as: 'seatLocks', foreignKey: 'showtimeId' });
Seat.hasMany(SeatLock, { as: 'locks', foreignKey: 'seatId' });
SeatLock.belongsTo(User, { as: 'user', foreignKey: 'userId' });
SeatLock.belongsTo(Showtime, { as: 'showtime', foreignKey: 'showtimeId' });
SeatLock.belongsTo(Seat, { as: 'seat', foreignKey: 'seatId' });

export {
  Country,
  Department,
  City,
  Cinema,
  Movie,
  Showtime,
  User,
  Profile,
  Membership,
  PurchaseHistory,
  RefreshToken,
  AccessAudit,
  PasswordResetToken,
  ReleaseNotification,
  Seat,
  SeatLock,
};
