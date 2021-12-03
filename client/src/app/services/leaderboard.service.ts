import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '@app/constants/url';
export interface Leaderboard {
    name: string;
    score: number;
    mode: string;
}

@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    urlString: string;
    leaderboardClassic: Leaderboard[];
    leaderboardMode2990: Leaderboard[];

    constructor(private http: HttpClient) {
        this.urlString = SERVER_URL + '/leaderboard';
    }

    async fetchClassic() {
        const getClassicUrl = this.urlString + '/ClassicLeaderboard';
        await this.http.get<Leaderboard[]>(getClassicUrl).subscribe((data) => {
            this.leaderboardClassic = this.sortLeaderBoard(data);
        });
    }
    async fetchLog2990() {
        const getlog2990Url = this.urlString;
        await this.http.get<Leaderboard[]>(getlog2990Url).subscribe((data) => {
            this.leaderboardMode2990 = this.sortLeaderBoard(data);
        });
    }
    sortLeaderBoard(data: Leaderboard[]): Leaderboard[] {
        return data.sort((a: Leaderboard, b: Leaderboard) => b.score - a.score);
    }

    async reset() {
        this.http.get<void>(this.urlString + '/reset').subscribe();
    }
}
