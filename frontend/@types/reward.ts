export interface Reward {
	id: string;
	userId: string;
	amount: string;
	type: string;
	onChainTxHash: string | null;
	claimedAt: Date | null;
	createdAt: Date;
}

export enum RewardStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	FAILED = "FAILED",
}

export interface RewardPool {
	id: string;
	organizationId: string;
	totalAmount: string;
	currency: string;
	period: string;
	distributedAmount: string;
	status: RewardPoolStatus;
	createdAt: Date;
}

export enum RewardPoolStatus {
	ACTIVE = "ACTIVE",
	DISTRIBUTING = "DISTRIBUTING",
	COMPLETED = "COMPLETED",
}

export interface RewardTransaction {
	id: string;
	userId: string;
	amount: string;
	currency: string;
	type: string;
	status: string;
	txHash: string | null;
	date: string;
}

export enum TransactionStatus {
	PENDING = "PENDING",
	CONFIRMED = "CONFIRMED",
	FAILED = "FAILED",
}
