/**
 * Dashboard Statistics
 */
export interface DashboardStats {
    totalTours: number;
    activeTours: number;
    inactiveTours: number;
    totalBookings: number;
    totalRevenue: number;
    pendingBookings: number;
    totalUsers: number;
    totalReviews: number;
    avgRating: number;
}

/**
 * Revenue by Month
 */
export interface RevenueByMonth {
    month: number;
    revenue: number;
}

/**
 * Top Tour by Revenue
 */
export interface TopTourRevenue {
    tourId: number;
    title: string;
    totalRevenue: number;
    totalBookings: number;
}

/**
 * Top Tour by Rating
 */
export interface TopTourRating {
    tourId: number;
    title: string;
    ratingAvg: number;
    ratingCount: number;
    coverImage: string;
    price: number;
}

/**
 * Tour List Item (Admin)
 */
export interface AdminTourListItem {
    tourId: number;
    title: string;
    location: string;
    price: number;
    durationDays: number;
    status: "ACTIVE" | "INACTIVE";
    coverImage?: string;
    ratingAvg: number;
    ratingCount: number;
    createdAt: string;
    category?: {
        categoryId: number,
        name: string,
    };
    _count: {
        bookings: number,
        reviews: number,
    };
}

/**
 * Tour Detail (Admin)
 */
export interface AdminTourDetail {
    tourId: number;
    title: string;
    description: string;
    location: string;
    durationDays: number;
    price: number;
    coverImage?: string;
    status: "ACTIVE" | "INACTIVE";
    ratingAvg: number;
    ratingCount: number;
    categoryId?: number;
    createdAt: string;
    updatedAt: string;
    category?: {
        categoryId: number,
        name: string,
    };
    images: TourImage[];
    schedules: TourSchedule[];
    _count: {
        bookings: number,
        reviews: number,
    };
}

export interface TourImage {
    imageId?: number;
    imageUrl: string;
    isCover?: boolean;
}

export interface TourSchedule {
    scheduleId?: number;
    dayNumber: number;
    title: string;
    description: string;
    image?: string;
}

/**
 * Tour Stats
 */
export interface TourStats {
    tour: {
        tourId: number,
        title: string,
        price: number,
        status: string,
    };
    totalBookings: number;
    totalRevenue: number;
    completedBookings: number;
    avgRating: number;
    totalReviews: number;
    bookingsByMonth: number;
}

/**
 * Tour Form Data
 */
export interface TourFormData {
    title: string;
    description: string;
    location: string;
    durationDays: number;
    price: number;
    categoryId?: number;
    status: "ACTIVE" | "INACTIVE";
    coverImage?: string;
    images?: TourImage[];
    schedules?: TourSchedule[];
}

/**
 * Pagination
 */
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Tour List Response
 */
export interface TourListResponse {
    tours: AdminTourListItem[];
    pagination: Pagination;
}

/**
 * Filters
 */
export interface AdminTourFilters {
    page?: number;
    limit?: number;
    status?: "ACTIVE" | "INACTIVE";
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
