import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Asset, AssetService, Category } from './services/asset.service';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, DropdownModule, ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  assets: Asset[] = [];
  categories: Category[] = [];
  assetForm: FormGroup;
  displayDialog: boolean = false;
  dialogHeader: string = '';

  constructor(
    private assetService: AssetService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    // Reactive Form Setup
    this.assetForm = this.fb.group({
      id: [null],
      assetName: ['', Validators.required],
      description: [''],
      serialNumber: [''],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.assetService.getCategories().subscribe(data => this.categories = data);
    this.assetService.getAssets().subscribe(data => this.assets = data);
  }

  showDialog(asset?: Asset) {
    this.displayDialog = true;
    if (asset) {
      this.dialogHeader = 'Edit Asset';
      this.assetForm.patchValue(asset);
    } else {
      this.dialogHeader = 'New Asset';
      this.assetForm.reset();
    }
  }

  saveAsset() {
    if (this.assetForm.invalid) return;

    // 1. ก๊อปปี้ค่าจากฟอร์มมาก่อน (เพื่อไม่ให้กระทบฟอร์มจริง)
    const assetData = { ...this.assetForm.value };

    // 2. เช็คว่าถ้าเป็นของใหม่ (ไม่มี ID) ให้ลบ field 'id' ทิ้งไปเลย
    // (เพราะ Backend จะงงถ้าส่ง id: null ไปให้ตัวแปรที่เป็น int)
    if (!assetData.id) {
        delete assetData.id;
    }

    // 3. ส่งข้อมูลที่ Clean แล้วไปให้ Backend
    if (this.assetForm.value.id) {
      this.assetService.updateAsset(assetData.id, assetData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated successfully' });
          this.loadData();
          this.displayDialog = false;
        },
        error: (err) => {
            console.error('Error updating:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update Failed' });
        }
      });
    } else {
      this.assetService.createAsset(assetData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Created successfully' });
          this.loadData();
          this.displayDialog = false;
        },
        error: (err) => {
            console.error('Error creating:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Create Failed' });
        }
      });
    }
  }

  deleteAsset(id: number) {
    if(confirm('Are you sure?')) {
      this.assetService.deleteAsset(id).subscribe(() => {
        this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Asset deleted' });
        this.loadData();
      });
    }
  }
}