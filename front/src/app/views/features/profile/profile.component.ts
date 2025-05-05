import { Component, OnInit } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ImageCropperComponent,
  ImageCroppedEvent,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../auth/login/auth-service.service';
import { Review } from './Review';
import { ReviewService } from './review.service';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgbRatingModule,
    FormsModule,
    ImageCropperComponent,
    FeatherIconDirective,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  styles: [
    `
      svg,
      i {
        color: rgba(114, 124, 245, 0.3);
      }
      i {
        font-size: 1.5rem;
      }
      svg {
        width: 20px;
        height: 20px;
      }
      .filled svg,
      .filled i {
        color: #727cf5;
      }
      .bad svg,
      .bad i {
        color: rgba(255, 51, 102, 0.3);
      }
      .filled.bad svg,
      .filled.bad i {
        color: #727cf5;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  userId: string | null = '';
  // Profile Data
  firstName!: string;
  lastName!: string;
  birthDate!: string;
  competences!: { name: string }[];
  formations!: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
  experiences!: {
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string;
  }[];

  // Rating
  currentRate = 8;

  // Image Cropper
  imageChangedEvent: any = '';
  croppedImage: SafeUrl = '';
  showImageCropper = false;
  croppedImageBlob: Blob | null = null;
  uploadSuccess = false;
  uploadError = false;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthServiceService,
    private reviewService: ReviewService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  reviews: Review[] = [];
  averageRating: number = 0;
  newReview: Partial<Review> = {
    rating: 0,
    comment: '',
  };
  currentUserId;
  imagename;
  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    const user: any = this.authService
      .getUserById(this.userId)
      .subscribe((user) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.birthDate = user.birthDate;
        this.competences = user.competences;
        this.formations = user.formations;
        this.experiences = user.experiences;
      });
    this.loadReviews();
    this.loadAverageRating();
    this.imagename = localStorage.getItem('imageFilename');
    // Assign values from user object
  }

  loadReviews() {
    this.reviewService.getReviews(this.userId).subscribe((reviews) => {
      this.reviews = reviews;
    });
  }

  loadAverageRating() {
    this.reviewService.getAverageRating(this.userId).subscribe((rating) => {
      this.averageRating = rating;
    });
  }

  submitReview() {
    this.newReview.reviewedId = this.userId;
    this.newReview.reviewerId = this.userId; // Replace with actual reviewer ID from auth
    console.log(this.newReview);

    this.reviewService.submitReview(this.newReview).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReview = { rating: 0, comment: '' };
        this.loadAverageRating();
      },
      error: (err) => console.error('Error submitting review:', err),
    });
  }
  getUserImageUrl(): string {
    console.log(this.imagename);
    return this.imagename == 'undefined' || this.imagename == 'null'
      ? '/profile.jpg'
      : `http://localhost:8082/api/user/${this.userId}/image`;
  }
  deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
        this.loadAverageRating();
      },
      error: (err) => console.error('Error deleting review:', err),
    });
  }

  // Modify the imageCropped function
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
      event.objectUrl || ''
    );

    // Get the cropped image blob for upload
    if (event.blob) {
      this.croppedImageBlob = event.blob;
    }
  }

  uploadImage() {
    if (!this.croppedImageBlob) {
      console.error('No image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.croppedImageBlob, 'profile-image.png');

    this.http
      .post(`http://localhost:8082/api/user/${this.userId}/image`, formData)
      .subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          this.uploadSuccess = true;
          this.uploadError = false;
          // Reset status after 3 seconds
          setTimeout(() => (this.uploadSuccess = false), 3000);
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.uploadError = true;
          this.uploadSuccess = false;
          setTimeout(() => (this.uploadError = false), 3000);
        },
      });

    localStorage.setItem('imageFilename', 'uploaded');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showImageCropper = true;
  }

  loadImageFailed() {
    this.showImageCropper = false;
  }
}
