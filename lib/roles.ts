export const getUserRole = (email: string) => {
  // Aquí defines los dominios o correos específicos para cada rol
  if (email.endsWith('@admin.com')) {
    return 'admin';
  } else if (email.endsWith('@operator.com')) {
    return 'operator';
  } else {
    return 'client';
  }
};

export const getRoleRedirectPath = (role: string) => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'operator':
      return '/dashboard/operator';
    case 'client':
      return '/dashboard/client';
    default:
      return '/dashboard/client';
  }
};