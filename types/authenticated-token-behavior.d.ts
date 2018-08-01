declare function AuthenticatedTokenBehavior<T extends new (...args: any[]) => {}>(base: T): AuthenticatedTokenBehaviorConstructor&T;

interface AuthenticatedTokenBehaviorConstructor {
  new(...args: any[]): AuthenticatedTokenBehavior;
}

interface AuthenticatedTokenBehavior {
  _getAccessTokenAsync(): Promise<string>;
}