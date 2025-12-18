export const TourStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};

export class Tour {
    constructor(data) {
        this.tourId = data.tourId;
        this.title = data.title;
        this.description = data.description;
        this.categoryId = data.categoryId;
        this.location = data.location;
        this.durationDays = data.durationDays;
        this.price = parseFloat(data.price);
        this.coverImage = data.coverImage;
        this.basicInfo = data.basicInfo;
        this.highlightInfo = data.highlightInfo;
        this.ratingAvg = parseFloat(data.ratingAvg);
        this.ratingCount = data.ratingCount;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        // Relations
        this.category = data.category ? new TourCategory(data.category) : null;
        this.images = data.images?.map((img) => new TourImage(img)) || [];
        this.schedules = data.schedules?.map((sch) => new TourSchedule(sch)) || [];
        this.reviews = data.reviews?.map((rev) => new Review(rev)) || [];
        this._count = data._count || { bookings: 0, reviews: 0 };
    }
}

export class TourCategory {
    constructor(data) {
        this.categoryId = data.categoryId;
        this.name = data.name;
        this.description = data.description;
    }
}

export class TourImage {
    constructor(data) {
        this.imageId = data.imageId;
        this.tourId = data.tourId;
        this.imageUrl = data.imageUrl;
        this.isCover = data.isCover;
    }
}

export class TourSchedule {
    constructor(data) {
        this.scheduleId = data.scheduleId;
        this.tourId = data.tourId;
        this.dayNumber = data.dayNumber;
        this.title = data.title;
        this.description = data.description;
        this.image = data.image;
    }
}

export class Review {
    constructor(data) {
        this.reviewId = data.reviewId;
        this.userId = data.userId;
        this.tourId = data.tourId;
        this.rating = data.rating;
        this.comment = data.comment;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.user = data.user;
    }
}

export class TourFilters {
    constructor(data = {}) {
        this.page = data.page || 1;
        this.limit = data.limit || 12;
        this.categoryId = data.categoryId || null;
        this.minPrice = data.minPrice || null;
        this.maxPrice = data.maxPrice || null;
        this.minDuration = data.minDuration || null;
        this.maxDuration = data.maxDuration || null;
        this.search = data.search || null;
        this.sortBy = data.sortBy || "createdAt";
        this.sortOrder = data.sortOrder || "desc";
        this.status = data.status || "ACTIVE";
    }
}

export class Pagination {
    constructor(data) {
        this.page = data.page;
        this.limit = data.limit;
        this.total = data.total;
        this.totalPages = data.totalPages;
    }
}
