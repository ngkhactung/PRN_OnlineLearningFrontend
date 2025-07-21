// src/constants/enums.js

export const UserStatus = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    BANNED: "Banned",
    PENDING: "Pending",
    DELETED: "Deleted"
};

export const UserRole = {
    STUDENT: "Student",
    ADMIN: "Admin"
};

export const getUserStatusText = (status) => {
    switch (status) {
        case UserStatus.ACTIVE:
            return 'Hoạt động';
        case UserStatus.INACTIVE:
            return 'Không hoạt động';
        case UserStatus.BANNED:
            return 'Bị cấm';
        case UserStatus.PENDING:
            return 'Chờ xác thực';
        case UserStatus.DELETED:
            return 'Đã xóa';
        default:
            return 'Không xác định';
    }
};

export const getUserRoleText = (role) => {
    switch (role) {
        case UserRole.STUDENT:
            return 'Học viên';
        case UserRole.ADMIN:
            return 'Quản trị viên';
        default:
            return 'Không xác định';
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case UserStatus.ACTIVE:
            return 'text-green-600 bg-green-100';
        case UserStatus.INACTIVE:
            return 'text-gray-600 bg-gray-100';
        case UserStatus.BANNED:
            return 'text-red-600 bg-red-100';
        case UserStatus.PENDING:
            return 'text-yellow-600 bg-yellow-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};
