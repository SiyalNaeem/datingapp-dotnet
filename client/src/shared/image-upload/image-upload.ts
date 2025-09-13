import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {

  protected imageSrc = signal<string | ArrayBuffer | null | undefined>(null);
  protected isDragging = false;
  private fileToUpload: File | null = null;
  uploadFile = output<File>();
  loading = input<boolean>(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDragDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if(event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
      // this.uploadFile.emit(file);
      event.dataTransfer.clearData();
    }

  }

  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = e => this.imageSrc?.set(e.target?.result);
    reader.readAsDataURL(file);
  }

  onCancel(){
    this.imageSrc.set(null);
    this.fileToUpload = null;
  }

  onUploadFile(){
    if(this.fileToUpload){
      this.uploadFile.emit(this.fileToUpload);
    }
  }

  onFileSelected(event: any){
    const file = event.target?.files?.item(0);
    if(file){
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }

}
