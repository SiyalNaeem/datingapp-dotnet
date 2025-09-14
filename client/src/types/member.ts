export type Member = {
    id: string;
    dateOfBirth: string;
    imageUrl?: string;
    displayName: string;
    created: string;
    lastActive: string;
    gender: string;
    description?: string;
    city: string;
    country: string;
}

export type Photo = {
    id: number;
    url: string;
    publicId?: string;
    isMain: boolean;
    memberId: string;
}

export type EditableMemberFields = {
    displayName: string;
    description?: string;
    city: string;
    country: string;
}

export class MemberParams {
    gender?: string;
    minAge: number = 18;
    maxAge: number = 100;
    pageNumber: number = 1;
    pageSize: number = 10;
    orderBy: string = 'lastActive';
}