declare function AuthenticatedPersonBehavior<T extends new (...args: any[]) => {}>(base: T): AuthenticatedPersonBehaviorConstructor&T;

interface AuthenticatedPersonBehaviorConstructor {
  new(...args: any[]): AuthenticatedPersonBehavior;
}

interface AuthenticatedPersonBehavior {
  personId: number;
  fullname: string;
  firstName: string;
  lastName: string;
  _getPersonAsync(): Promise<{personId: number, fullname: string, firstName: string, lastName: string}>;
}