'use strict';

// Reads the name of the database constraint that an insert, update or delete broke.
// Returns null when the error is not a constraint violation.

const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

function constraintOf(error) {
  if (
    error instanceof UniqueConstraintError ||
    error instanceof ForeignKeyConstraintError
  ) {
    return (error.parent && error.parent.constraint) || error.index || 'unknown';
  }

  // Handle PostgreSQL constraint errors wrapped as SequelizeDatabaseError.
  const parent = error.parent || error.original;

  if (
    parent &&
    ['23001', '23503'].includes(parent.code) &&
    parent.constraint
  ) {
    return parent.constraint;
  }

  return null;
}

module.exports = { constraintOf };