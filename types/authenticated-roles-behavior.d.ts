declare function AuthenticatedRolesBehavior<T extends new (...args: any[]) => {}>(base: T): AuthenticatedRolesBehaviorConstructor&T;

interface AuthenticatedRolesBehaviorConstructor {
  new(...args: any[]): AuthenticatedRolesBehavior;
}

interface AuthenticatedRolesBehavior {
  roles: Array<string>;
  _onAuthComplete(e: Event)
}