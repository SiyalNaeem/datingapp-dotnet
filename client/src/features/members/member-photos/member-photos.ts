import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from "../../../shared/star-button/star-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {

  protected memberSvc = inject(MemberService);
  protected accountSvc = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')!;
    if(memberId){
      this.memberSvc.getMemberPhotos(memberId).subscribe({
        next: this.photos.set,
        error: err => console.log(err)
      })
    }
  }

  onUploadPhoto(file: File){
    this.loading.set(true);
    this.memberSvc.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberSvc.editMode.set(false);
        this.photos.update(photos => [...photos, photo]);
        this.loading.set(false);
      },
      error: err => {
        console.log("Error uploading photo: ", err);
        this.loading.set(false);
      }
    });
  }

  setMainPhoto(photo: Photo){
    this.memberSvc.setMainPhoto(photo.id).subscribe({
      next: () => {
        const currentUser = this.accountSvc.currentUser();

        if(currentUser){
          currentUser.imageUrl = photo.url
        }

        this.accountSvc.setCurrentUser(currentUser as User);

        this.memberSvc.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member);

        this.photos.update(photos => {
          photos.forEach(p => {
            if(p.isMain) p.isMain = false;
            if(p.id === photo.id) p.isMain = true;
          });
          return photos;
        });
      },
      error: err => {
        console.log("Error setting main photo: ", err);
      }
    });
  }

  deletePhoto(photo: Photo){
    this.memberSvc.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photo.id));
      },
      error: err => {
        console.log("Error deleting photo: ", err);
      }
    });
  }
}