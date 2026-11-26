import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { User } from '../../modeles/user.modele';
import { Login, Logout } from './auth.actions';

// On réutilise User comme profil
export type UserProfile = User;

export interface AuthStateModel {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const ETAT_INITIAL: AuthStateModel = { user: null, isAuthenticated: false };

@State<AuthStateModel>({
  name: 'auth',
  defaults: ETAT_INITIAL,
})
@Injectable()
export class AuthState {
  @Selector()
  static user(state: AuthStateModel): UserProfile | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static username(state: AuthStateModel): string {
    return state.user ? `${state.user.prenom} ${state.user.nom}` : '';
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login): void {
    ctx.patchState({ user: action.payload, isAuthenticated: true });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>): void {
    ctx.setState(ETAT_INITIAL);
  }
}
