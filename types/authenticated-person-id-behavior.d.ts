declare function AuthenticatedPersonIdBehavior<T extends new (...args: any[]) => {}>(base: T): AuthenticatedPersonIdBehaviorConstructor&T;

interface AuthenticatedPersonIdBehaviorConstructor {
  new(...args: any[]): AuthenticatedPersonIdBehavior;
}

interface AuthenticatedPersonIdBehavior {
  personId: number;
  _onAuthComplete(e: Event)
}