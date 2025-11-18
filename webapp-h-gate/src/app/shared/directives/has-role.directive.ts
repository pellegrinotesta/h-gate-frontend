import { Directive, TemplateRef, ViewContainerRef, Input } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AuthenticatedUser } from "../../models/authenticated-user.model";

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) { }

  @Input() set hasRole(authorizedRoles: string[] | undefined) {
    const currentUserInfo: AuthenticatedUser | null = this.userService.getAuthenticatedUser();

    if (!authorizedRoles || authorizedRoles.length === 0) {
      this.showElement();
      return;
    }

    if (!currentUserInfo) {
      this.clearElement();
      return;
    }

    const userRole = currentUserInfo.role; // usa role dal token

    const isAuthorized = authorizedRoles.includes(userRole);

    if (isAuthorized && !this.hasView) {
      this.showElement();
    } else if (!isAuthorized && this.hasView) {
      this.clearElement();
    }
  }

  showElement(): void {
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
  }

  clearElement(): void {
    this.viewContainer.clear();
    this.hasView = false;
  }

}