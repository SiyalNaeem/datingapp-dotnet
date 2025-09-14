import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {

  private memberSvc = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  protected updatedParams = new MemberParams();

  @ViewChild('filterModal') 
  modal!: FilterModal;

  constructor() {
    const filters = localStorage.getItem('filters');
    if(filters) {
      this.memberParams = {...this.memberParams, ...JSON.parse(filters)};
      this.updatedParams = {...this.updatedParams, ...JSON.parse(filters)};
    }
  }

  ngOnInit() {
    this.loadMembers(this.memberParams);
  }

  loadMembers(memberParams: MemberParams) {
    this.memberSvc.getMembers(memberParams).subscribe({
      next: res => {
        this.updatedParams = memberParams;
        this.paginatedMembers.set(res);
      }, error: err => {
        console.log(err);
      }
    })
  }

  onPageChange(event: {pageNumber: number; pageSize: number}) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers(this.memberParams);
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log("Modal closed");
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = data;
    this.loadMembers(data);
  }

  resetFilters() {
    this.memberParams = new MemberParams();
    this.loadMembers(this.memberParams);
  }

  get displayMessage(): string {
    const defaultParams = new MemberParams();

    const filters: string[] = [];

    if(this.updatedParams.gender){
      filters.push(`Gender: ${this.updatedParams.gender}s`);
    }else{
      filters.push(`Gender: All`);
    }

    if(this.updatedParams.minAge !== defaultParams.minAge || this.updatedParams.maxAge !== defaultParams.maxAge){
      filters.push(`Ages: ${this.updatedParams.minAge} - ${this.updatedParams.maxAge}`);
    }

    filters.push(this.updatedParams.orderBy === 'lastActive' ? 'Recently Active' : 'Newest Members');

    return filters.length > 0 ? filters.join(' | ') : 'All Members';

  }

}
