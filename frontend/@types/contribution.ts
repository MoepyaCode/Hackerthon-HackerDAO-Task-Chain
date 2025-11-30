export interface Contribution {
	id: string;
	userId: string;
	repoId: string | null;
	contributionType: string; // Was type: ContributionType
	externalId: string;
	points: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata: any; // Was ContributionMetadata
	onChainTxHash: string | null;
	createdAt: Date;
	repo?: {
		fullName: string;
		organization?: {
			name: string;
		};
	};
}

export interface ContributionMetadata {
	githubId?: string | number;
	title?: string;
	url?: string;
	sha?: string;
	state?: string;
	merged?: boolean;
	additions?: number;
	deletions?: number;
	changedFiles?: number;
	[key: string]: string | number | boolean | undefined;
}

export enum ContributionType {
	ISSUE_CLOSED = "ISSUE_CLOSED",
	PR_OPENED = "PR_OPENED",
	PR_MERGED = "PR_MERGED",
	COMMIT_PUSHED = "COMMIT_PUSHED",
}

export interface ContributionStats {
	totalContributions: number;
	issuesClosed: number;
	prsOpened: number;
	prsMerged: number;
	commitsPushed: number;
	totalPoints: number;
	contributionsByType: Record<string, number>;
	lastUpdated: Date;
}

export interface ContributionHistory {
	date: string;
	contributions: Array<{
		id: string;
		type: ContributionType;
		points: number;
		timestamp: Date;
	}>;
	totalPoints: number;
}
