import { CommonModule, JsonPipe, NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormArray,
  FormGroup,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArchwizardModule } from '@rg-software/angular-archwizard';
import { WizardComponent as BaseWizardComponent } from '@rg-software/angular-archwizard';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { TagInputModule } from 'ngx-chips';
import { AuthServiceService } from '../auth/login/auth-service.service';
import { UserService } from '../auth/user.service';
import Swal from 'sweetalert2';

import {
  DropzoneModule,
  DropzoneConfigInterface,
  DROPZONE_CONFIG,
  DropzoneDirective,
} from 'ngx-dropzone-wrapper';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'http://localhost:8082/api/user/',
  acceptedFiles: 'application/pdf',
  maxFilesize: 5,
};

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ArchwizardModule,
    NgClass,
    ReactiveFormsModule,
    FeatherIconDirective,
    TagInputModule,
    FormsModule,
    JsonPipe,

    DropzoneModule,
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
  templateUrl: './starter.component.html',
  styleUrl: './starter.component.scss',
})
export class StarterComponent implements OnInit {
  validationForm1: UntypedFormGroup;
  validationForm2: UntypedFormGroup;
  formationForm: UntypedFormGroup;
  experienceForm: UntypedFormGroup;
  competenceForm: UntypedFormGroup;
  itemsAsObjects: any[] = [];

  isForm1Submitted: Boolean = false;
  isForm2Submitted: Boolean = false;
  isFormationSubmitted: Boolean = false;
  isExperienceSubmitted: Boolean = false;
  isCompetenceSubmitted: Boolean = false;
  userId: any;

  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;

  public config: DropzoneConfigInterface;

  @ViewChild(DropzoneDirective, { static: false })
  directiveRef?: DropzoneDirective;

  constructor(
    public formBuilder: UntypedFormBuilder,
    private authService: AuthServiceService,
    private userService: UserService,
    private router: Router
  ) {
    this.userId = this.authService.getCurrentUserId();
    this.config = {
      url: `http://localhost:8082/api/user/${this.userId}/cv`,
      clickable: true,
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      addRemoveLinks: true,
      dictRemoveFile: 'Delete',
    };
  }
  role;
  completed;
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.completed = localStorage.getItem('completed');

    if (this.completed == '1') {
      this.router.navigate(['/dashboard']);
    }
    if (this.role == 'ROLE_ADMIN') {
      this.router.navigate(['/dashboard']);
    } else if (this.role == 'ROLE_CLIENT') {
      this.router.navigate(['/home']);
    }

    // Personal Info Form
    this.validationForm1 = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
    });

    // Account Info Form
    this.validationForm2 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Formation Form
    this.formationForm = this.formBuilder.group({
      formations: this.formBuilder.array([this.createFormationGroup()]),
    });

    // Experience Form
    this.experienceForm = this.formBuilder.group({
      experiences: this.formBuilder.array([this.createExperienceGroup()]),
    });
    this.competenceForm = this.formBuilder.group({
      competences: new FormControl([], Validators.required),
    });
  }

  // Add CV methods

  onUploadError(event: any): void {
    console.log('onUploadError:', event);
  }

  onUploadSuccess(event: any): void {
    console.log('onUploadSuccess:', event);
  }

  resetDropzoneUploads(): void {
    if (this.directiveRef) {
      this.directiveRef.reset();
    }
  }

  onRemovedFile(file: File): void {
    console.log(file);
  }

  // Add competence control getter
  get competencesControl() {
    return this.competenceForm.get('competences') as FormControl;
  }

  // Add competence submit handler
  competenceSubmit(): void {
    this.isCompetenceSubmitted = true;
    if (this.competenceForm.valid) {
      this.wizardForm.goToNextStep();
    }
  }
  // Formation Form Array Methods
  get formations(): FormArray {
    return this.formationForm.get('formations') as FormArray;
  }

  cvSubmit(): void {
    this.wizardForm.goToNextStep();
  }

  createFormationGroup(): FormGroup {
    return this.formBuilder.group({
      diploma: ['', Validators.required],
      institution: ['', Validators.required],
      fieldOfStudy: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      description: [''],
    });
  }

  addFormation(): void {
    this.formations.push(this.createFormationGroup());
  }

  removeFormation(index: number): void {
    if (this.formations.length > 1) {
      this.formations.removeAt(index);
    }
  }

  // Experience Form Array Methods
  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }

  createExperienceGroup(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      currentJob: [false],
      description: [''],
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
  }

  removeExperience(index: number): void {
    if (this.experiences.length > 1) {
      this.experiences.removeAt(index);
    }
  }

  // Form Submission Handlers
  form1Submit(): void {
    this.isForm1Submitted = true;
    if (this.validationForm1.valid) {
      this.wizardForm.goToNextStep();
    }
  }

  form2Submit(): void {
    this.isForm2Submitted = true;
    if (this.validationForm2.valid) {
      this.wizardForm.goToNextStep();
    }
  }

  formationSubmit(): void {
    this.isFormationSubmitted = true;
    if (this.formationForm.valid) {
      this.wizardForm.goToNextStep();
    }
  }

  experienceSubmit(): void {
    this.isExperienceSubmitted = true;
    if (this.experienceForm.valid) {
      this.wizardForm.goToNextStep();
    }
  }

  // Final Submission
  finishFunction(): void {
    const userData = {
      firstName: this.validationForm1.value.firstName,
      lastName: this.validationForm1.value.lastName,
      birthDate: this.validationForm1.value.birthDate,
      completed: true,
      competences: this.competenceForm.value.competences.map((c: any) => ({
        name: c.name,
      })),
      formations: this.formationForm.value.formations.map((f: any) => ({
        institution: f.institution,
        degree: f.diploma,
        fieldOfStudy: f.fieldOfStudy,
        startDate: f.startDate,
        endDate: f.endDate,
      })),
      experiences: this.experienceForm.value.experiences.map((e: any) => ({
        title: e.title,
        company: e.company,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
      })),
    };
    const userId: any = this.authService.getCurrentUserId();

    this.userService.updateUser(userData, userId).subscribe({
      next: (response) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Your account has be completed',
          icon: 'success',
        });
        this.resetForms();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur de mise à jour', err.message);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          title: err,
          icon: 'error',
        });
      },
    });
  }

  // Helper Methods
  get form1() {
    return this.validationForm1.controls;
  }

  get form2() {
    return this.validationForm2.controls;
  }

  private resetForms(): void {
    this.validationForm1.reset();
    this.formationForm.reset();
    this.experienceForm.reset();
    this.wizardForm.reset();
  }
}
